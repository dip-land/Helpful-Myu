import { Client, Collection, Partials, Routes } from 'discord.js';
import { Client as test } from './structures/client.js';
import { MongoClient } from 'mongodb';
import 'dotenv/config';
import glob from 'glob';
import type { Command } from './structures/command.js';
import type { Event } from './structures/event.js';

export const client = new test({
    intents: ['Guilds', 'GuildMessages', 'MessageContent', 'GuildMembers', 'GuildMessageReactions'],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});
export const mongoClient = new MongoClient(process.env.MONGOURI, { connectTimeoutMS: 10_000, retryReads: true, retryWrites: true });

const registerEvents = async () => {
    for (const eventPath of (await glob('./dist/events/**/*.js', { platform: 'linux' })).toString().replaceAll('dist', '.').split(',')) {
        try {
            const event: Event = (await import(eventPath)).default;
            if (event.on) client.on(event.name, (...args) => event.fn(...args));
            else client.once(event.name, (...args) => event.fn(...args));
        } catch (err: Error | unknown) {
            console.log(client.timeCode('error'), eventPath, err);
        }
    }
    console.log(`${client.timeCode()} 100% Events loaded.`);
};
registerEvents();

client.cooldowns = new Collection();
client.legacyCommands = new Collection();

const registerCommands = async () => {
    const commands: Array<unknown> = [];
    for (const cmdPath of (await glob('./dist/commands/**/*.js', { platform: 'linux' })).toString().replaceAll('dist', '.').split(',')) {
        try {
            const command: Command = (await import(cmdPath)).default as Command;
            client.legacyCommands.set(command.commandObject?.name, command);
            if ('slashCommand' in command && ((!client.beta && !command.commandObject.beta) || client.beta)) commands.push(command.applicationData as never);
            if (command.commandObject.aliases) for (const alias of command.commandObject.aliases) client.legacyCommands.set(alias, command);
        } catch (err: Error | unknown) {
            console.log(client.timeCode('error'), cmdPath, err);
        }
    }
    console.log(`${client.timeCode()} 100% Commands loaded.`);
    return commands;
};

client.once('ready', async () => {
    console.log(`${client.timeCode()} ${client.user?.username} online.`);
    const commands = await registerCommands();
    if (!client.isReady() || !client.user) return;
    if (!client.beta) client.rest.put(Routes.applicationCommands(client.user.id), { body: commands }).catch((err) => console.log(client.timeCode('error'), err));
    else client.rest.put(Routes.applicationGuildCommands(client.user.id, '981639333549322262'), { body: commands }).catch((err) => console.log(client.timeCode('error'), err));
});
client.login({ hm: process.env.HMTOKEN, nm: process.env.NMTOKEN, beta: process.env.BETATOKEN, undefined: process.env.BETATOKEN }[client.version]);
