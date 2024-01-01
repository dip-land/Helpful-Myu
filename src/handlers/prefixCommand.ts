import type { Collection, Message } from 'discord.js';
import { client } from '../index.js';

export default (message: Message, prefix: string) => {
    const args = message.content.slice(prefix.length).split(/\s+(?=(?:[^"]*"[^"]*")*[^"]*$)/g);
    const cmd = client.prefixCommands.get(args.shift()?.toLowerCase() as string);
    if (!cmd || !cmd.prefixCommand || !message.channel.isTextBased() || message.channel.isDMBased() || message.channel.isThread()) return message.reply('Command unavailable.');
    if (client.isShhh(message.author)) return cmd.prefixCommand({ message, args, client });
    if (cmd.disabled) return message.reply('This command is disabled, it may be re-enabled in the future.');
    if (cmd.nsfw && !message.channel.nsfw) return message.reply('This command cannot be used here.');

    const timestamps = client.cooldowns.get(cmd.name) as Collection<string, number>;
    const now = Date.now();
    if (timestamps.has(message.author.id)) {
        const expire = (timestamps.get(message.author.id) as number) + cmd.cooldown;
        if (now < expire) return message.reply(`Please wait \`${(expire - now) / 1_000}\` seconds before reusing the \`${cmd.name}\` command.`);
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cmd.cooldown);

    if (cmd.permissions) {
        for (const permission of cmd.permissions) {
            if (!message.member?.permissions.has(permission)) return message.reply('You seem to be missing permissions to use this command.');
        }
    }

    cmd.prefixCommand({ message, args, client }).catch((err) => client.error(err));
};
