import { Client, Collection, Routes } from 'discord.js';
import { MongoClient } from 'mongodb';
import 'dotenv/config';
import { exec } from 'child_process';
import { platform } from 'os';
import glob from 'glob';
import type { Command } from './structures/command.js';
import type { Event } from './structures/event.js';

export const beta = platform() === 'win32';
export const token = beta ? (process.env.BETATOKEN as string) : (process.env.TOKEN as string);
export const client = new Client({ intents: ['Guilds', 'GuildMessages', 'MessageContent', 'GuildMembers', 'GuildVoiceStates'] });
export const mongoClient = new MongoClient(beta ? (process.env.MBMONGOURI as string) : (process.env.MONGOURI as string));
export const embedColor = beta ? 0xf6e47f : 0xafbbea;

glob('./dist/events/**/*.js', async (err: Error | null, paths: Array<string>) => {
    let count = 0;
    for (const path of paths) {
        try {
            const event: Event = (await import(path.replace('./dist', './'))).default;
            if (event.on) client.on(event.name, (...args) => event.fn(...args));
            else client.once(event.name, (...args) => event.fn(...args));
            count++;
            console.log(count === paths.length ? '\x1b[2;0H100% Events loaded.' : `\x1b[2;0H${Math.round((count / paths.length) * 100)}%`);
        } catch (err: Error | unknown) {
            console.log(err);
        }
    }
});

client.cooldowns = new Collection();
client.legacyCommands = new Collection();
export const commands = [];

glob('./dist/commands/**/*.js', async (err: Error | null, paths: Array<string>) => {
    for (const path of paths) {
        try {
            const command: Command = (await import(path.replace('./dist', './'))).default as Command;
            client.legacyCommands.set(command.commandObject?.name, command);
            if (typeof command?.slashCommand === 'function') {
                commands.push(command.applicationData as never);
            }
            if (command.commandObject.aliases) {
                for (const alias of command.commandObject.aliases) {
                    client.legacyCommands.set(alias, command);
                }
            }
            console.log(commands.length === paths.length ? '\x1b[3;0H100% Commands loaded.' : `\x1b[3;0H${Math.round((commands.length / paths.length) * 100)}%`);
        } catch (err: Error | unknown) {
            console.log(path, err);
        }
    }
    if (client.isReady()) {
        // if (beta) {
        //     client.rest.put(Routes.applicationGuildCommands(client.user.id, '981639333549322262'), { body: commands }).catch((err) => {
        //         console.error(err);
        //     });
        // } else {
        //     client.rest.put(Routes.applicationCommands(client.user.id), { body: commands }).catch(console.error);
        // }
    }
});

client.once('ready', async () => {
    console.log('\x1b[2J');
    console.log(`\x1b[H${client.user?.username} online.`);
});

client.login(token);
if (!beta) {
    let previous = 0;
    setInterval(() => {
        exec('ping -c 1 8.8.8.8', (e, stdout, stderr) => {
            if (previous === 1 && e === null) process.kill(0);
            if (e !== null) previous = 1;
            else previous = 0;
        });
    }, 20000);
}
