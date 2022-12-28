import type { Message } from 'discord.js';
import prefixCommand from '../handlers/prefixCommand.js';
import { beta } from '../index.js';
import { Config } from '../handlers/database/mongo.js';
import messageFilter from '../handlers/messageFilter.js';
import { Event } from '../structures/event.js';

export default new Event({
    name: 'messageCreate',
    on: true,
    async fn(message: Message<boolean>) {
        if (message.author.bot) return;
        if (message.member?.displayName.toLowerCase().includes('mouse') && Math.ceil(Math.random() * 49) === 42) message.channel.send('🧀');
        if (message.content.toLowerCase().includes('stfu')) message.channel.send('slice the fudge, uwuu~ <3');
        messageFilter(message);

        const prefixes = beta ? [] : ['.', '<@995370187626905611>'];
        const configPrefixes = beta ? await Config.find({ type: 'prefix' }).toArray() : [];
        for (const prefix of configPrefixes) {
            prefixes.push(prefix.data as string);
        }
        if (!prefixes[0]) prefixes.push('hm!');
        const prefix = prefixes.find((p) => message.content.startsWith(p));
        if (prefix === undefined) return;
        prefixCommand(message, prefix, message.client);
    },
});
