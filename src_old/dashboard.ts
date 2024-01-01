import { type ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { type Channel, Client } from 'discord.js';
import 'dotenv/config';

function timeCode(version?: string, type?: 'error'): string {
    const color = version ? { hm: '\x1b[38;2;175;187;234m', nm: '\x1b[38;2;162;224;234m', beta: '\x1b[38;2;246;228;127m' }[version] : '';
    if (type === 'error') return `\x1b[31m[${new Date().toLocaleString()}]${version ? ` ${color}[${version.toUpperCase()}]\x1b[0m` : '\x1b[0m'}`;
    return `\x1b[36m[${new Date().toLocaleString()}]${version ? ` ${color}[${version.toUpperCase()}]\x1b[0m` : '\x1b[0m'}`;
}

console.log(`\x1b[2J\x1b[3J\x1b[H${timeCode()} Started bot program with PID ${process.pid}`);

let ProcessOut: Array<string> = [];

function createBot(version: string): void {
    const bot = spawn('node', ['.', version]);
    bot.stdout.on('data', (data) => {
        console.log(data.toString().replace('\n', ''));
        ProcessOut.push(`${version} >${data.toString().replace('\n', '').split(']').slice(2).join(' ').replace('\x1b[0m', '').slice(0, 500)}`);
    });
    bot.on('error', (err) => {
        exit(err, version, bot);
        ProcessOut.push(`${version} > ${err.toString().slice(0, 500)}...`);
    });
    bot.on('exit', (a) => {
        exit(a, version, bot);
        ProcessOut.push(`${version} > Exited with code ${a}, and is now attempting to restart...`);
    });
    bot.on('spawn', (a: unknown) => {
        console.log(timeCode(version), 'spawn', bot.pid);
        ProcessOut.push(`${version} > ${version} starting up with pid ${bot.pid}`);
    });
}

function exit(type: Error | number | null, version: string, bot: ChildProcessWithoutNullStreams): void {
    const isExit = typeof type === 'number' ? true : false;
    console.log(timeCode(version, 'error'), isExit ? 'exit' : 'error', type);
    ProcessOut.push(`${version} > Restarting...`);
    if (bot.killed || isExit) {
        createBot(version);
        console.log(timeCode(version, 'error'), 'bot encontered an error and was reloaded as pid', bot.pid);
    }
}

for (const version of ['hm', 'nm']) {
    createBot(version);
}

const client = new Client({
    intents: ['Guilds', 'GuildMessages'],
});

client.on('ready', async () => {
    const sendChannel = (await client.channels.fetch('1104785386754023546', { force: true }).catch((err) => console.log(err))) as Channel;
    try {
        if (!sendChannel.isTextBased()) return;
        setInterval(() => {
            try {
                if (ProcessOut[0])
                    sendChannel
                        .send([...new Set(ProcessOut)].join('\n'))
                        .then(() => (ProcessOut = []))
                        .catch((err) => console.log(err));
            } catch (err) {
                console.log(err);
            }
        }, 30_000);
    } catch (err) {
        console.log(err);
    }
});

client.login(process.env.MMTOKEN).catch((err) => console.log(err));
