import { Client, Collection, Partials, Routes } from 'discord.js';
import { MongoClient } from 'mongodb';
import 'dotenv/config';
import glob from 'glob';
import type { Command } from './structures/command.js';
import type { Event } from './structures/event.js';
import { readdir } from 'fs/promises';
import path from 'path';

export const version = process.argv.includes('-hm') ? 'hm' : process.argv.includes('-nm') ? 'nm' : 'beta';
export const client = new Client({
    intents: ['Guilds', 'GuildMessages', 'MessageContent', 'GuildMembers', 'GuildVoiceStates', 'GuildMessageReactions'],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});
export const mongoClient = new MongoClient(process.env.MONGOURI, { connectTimeoutMS: 10_000, retryReads: true, retryWrites: true });
export const embedColor = { hm: 0xafbbea, nm: 0xa2e0ea, beta: 0xf6e47f }[version];
export function timeCode(type?: 'error') {
    const color = { hm: '\x1b[38;2;175;187;234m', nm: '\x1b[38;2;162;224;234m', beta: '\x1b[38;2;246;228;127m' }[version];
    if (type === 'error') return `\x1b[31m[${new Date().toLocaleString()}] ${color}[${version.toUpperCase()}]\x1b[0m`;
    return `\x1b[36m[${new Date().toLocaleString()}] ${color}[${version.toUpperCase()}]\x1b[0m`;
}

const registerEvents = async () => {
    const eventFiles = (await glob('./dist/events/**/*.js', { platform: 'linux' })).toString().replaceAll('dist', '.').split(',');
    for (let i = 0; i < eventFiles.length; i++) {
        try {
            const event: Event = (await import(eventFiles[i])).default;
            if (event.on) client.on(event.name, (...args) => event.fn(...args));
            else client.once(event.name, (...args) => event.fn(...args));
            if (i + 1 === eventFiles.length) console.log(`${timeCode()} 100% Events loaded.`);
        } catch (err: Error | unknown) {
            console.log(timeCode('error'), eventFiles[i], err);
        }
    }
};
registerEvents();

client.cooldowns = new Collection();
client.legacyCommands = new Collection();
export const commands = [];

const registerCommands = async () => {
    const commandFiles = (await glob('./dist/commands/**/*.js', { platform: 'linux' })).toString().replaceAll('dist', '.').split(',');
    for (let i = 0; i < commandFiles.length; i++) {
        try {
            const command: Command = (await import(commandFiles[i])).default as Command;
            client.legacyCommands.set(command.commandObject?.name, command);
            if ('slashCommand' in command && ((version !== 'beta' && !command.commandObject.beta) || version === 'beta')) commands.push(command.applicationData as never);
            if (command.commandObject.aliases) for (const alias of command.commandObject.aliases) client.legacyCommands.set(alias, command);
            if (i + 1 === commandFiles.length) console.log(`${timeCode()} 100% Commands loaded.`);
        } catch (err: Error | unknown) {
            console.log(timeCode('error'), commandFiles[i], err);
        }
    }
    if (!client.isReady() || !client.user) return;
    if (version !== 'beta') return client.rest.put(Routes.applicationCommands(client.user.id), { body: commands }).catch((err) => console.log(timeCode('error'), err));
    client.rest.put(Routes.applicationGuildCommands(client.user.id, '981639333549322262'), { body: commands }).catch((err) => console.log(timeCode('error'), err));
    client.rest.put(Routes.applicationGuildCommands(client.user.id, '1065154256459542539'), { body: commands }).catch((err) => console.log(timeCode('error'), err));
};
registerCommands();

client.once('ready', async () => console.log(`${timeCode()} ${client.user?.username} online.`));
client.login({ hm: process.env.HMTOKEN, nm: process.env.NMTOKEN, beta: process.env.BETATOKEN }[version]);
