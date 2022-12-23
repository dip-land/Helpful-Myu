import { Client, Collection } from 'discord.js';

import 'dotenv/config';
import { exec } from 'child_process';
import { platform } from 'os';
export const beta = platform() === 'win32';
export const token = beta ? (process.env.BETATOKEN as string) : (process.env.HMTOKEN as string);

import glob from 'glob';
import type { Command } from './structures/command.js';
import type { Event } from './structures/event.js';

export const client = new Client({
	intents: ['Guilds', 'GuildMessages', 'MessageContent', 'GuildMembers', 'GuildVoiceStates'],
});

glob('./dist/events/**/*.js', async (err: Error | null, paths: Array<string>) => {
	const loadStart = Date.now();
	for (const path of paths) {
		try {
			const event: Event = (await import(path.replace('./dist', './'))).default;
			if (event.on) client.on(event.name, (...args) => event.fn(...args));
			else client.once(event.name, (...args) => event.fn(...args));
		} catch (err) {
			console.log(err);
		}
	}
	console.log(`Events Loaded. ${Date.now() - loadStart}ms`);
});

client.cooldowns = new Collection();
client.legacyCommands = new Collection();
export const commands = [];

glob('./dist/commands/**/*.js', async (err: Error | null, paths: Array<string>) => {
	const loadStart = Date.now();
	for (const path of paths) {
		try {
			const command: Command = (await import(path.replace('./dist', './'))).default;
			client.legacyCommands.set(command.commandObject?.name, command);
			if (typeof command?.slashCommand === 'function') commands.push(command.applicationData as never);
			if (command.commandObject.aliases) for (const alias of command.commandObject.aliases) client.legacyCommands.set(alias, command);
		} catch (err) {
			console.log(err);
		}
	}
	console.log(`Commands Loaded. ${Date.now() - loadStart}ms`);
});

client.login(token);
if (!beta) {
	let missedCheckIns = 0;
	setInterval(() => {
		exec('ping -c 1 8.8.8.8', (e, stdout, stderr) => {
			if (e !== null) missedCheckIns++;
			if (missedCheckIns > 20) {
				console.log('Too many check-ins missed, restarting...');
				process.kill(0);
			}
		});
	}, 1000);
}
