import { type Message, Collection } from 'discord.js';
import type { Client } from '../structures/client.js';
import type { Command } from '../structures/command.js';

export default (message: Message, prefix: string, client: Client) => {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase() as string;
    const command = client.legacyCommands.get(commandName) as Command;

    if (!command || !command.prefixCommand) return;
    if (command.commandObject.disabled) return message.reply('This command is currently disabled.');
    if (command?.commandObject?.beta && !client.beta) return;
    //cooldowns
    if (!client.cooldowns.has(commandName)) client.cooldowns.set(commandName, new Collection());
    const now = Date.now();
    const timestamps = client.cooldowns.get(commandName);
    const cooldownAmount = (command.commandObject.cooldown || 2) * 1_000;
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
            return message.reply(`Please wait ${((expirationTime - now) / 1_000).toFixed(1)} more second(s) before reusing the \`${command.commandObject.name}\` command.`);
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    if (command.commandObject.permissions && message.author.id !== '439039443744063488') {
        for (const permission of command.commandObject.permissions) {
            if (!message.member?.permissions.has(permission)) return message.reply('You seem to be missing permissions to use this command.');
        }
    }

    try {
        command.prefixCommand(message, args);
    } catch (err: Error | unknown) {
        console.log(client.timeCode('error'), err);
    }
};
