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

glob('./dist/events/**/*.js', async (err: Error | null, paths: Array<string>) => {
    for (const path of paths) {
        try {
            const event: Event = (await import(path.replace('./dist', './'))).default;
            if (event.on) client.on(event.name, (...args) => event.fn(...args));
            else client.once(event.name, (...args) => event.fn(...args));
        } catch (err) {
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
            const command: Command = (await import(path.replace('./dist', './'))).default;
            client.legacyCommands.set(command.commandObject?.name, command);
            if (typeof command?.slashCommand === 'function') {
                commands.push(command.applicationData as never);
            }
            if (command.commandObject.aliases) {
                for (const alias of command.commandObject.aliases) {
                    client.legacyCommands.set(alias, command);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
    if (client.isReady()) {
        if (beta) {
            client.rest.put(Routes.applicationGuildCommands('996196343120928859', '981639333549322262'), { body: commands }).catch(console.error);
        } else {
            client.rest.put(Routes.applicationCommands('995370187626905611'), { body: commands }).catch(console.error);
        }
    }
});

client.once('ready', () => {
    console.log(client.user?.username, 'online.');
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
    }, 1000);
}
