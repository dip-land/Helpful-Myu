import type { Message } from 'discord.js';
import prefixCommand from '../handlers/prefixCommand.js';
import { Config } from '../handlers/database/mongo.js';
import messageFilter from '../handlers/messageFilter.js';
import { Event } from '../structures/event.js';
import { version } from '../index.js';

let prefixes = await Config.find({ type: 'prefix' }).toArray();
export async function fetchPrefixes() {
    prefixes = await Config.find({ type: 'prefix' }).toArray();
}

export default new Event({
    name: 'messageCreate',
    async fn(message: Message<boolean>) {
        const channel = message.channel;
        if (message.author.bot) return;
        if (version === 'hm' && message.member?.displayName.toLowerCase().includes('mouse') && Math.ceil(Math.random() * 49) === 42 && channel.type === 0) channel.send('🧀');
        if (message.content.toLowerCase().includes('stfu') && channel.type === 0) channel.send('slice the fudge, uwuu~ <3');
        messageFilter(message);

        if (!prefixes[0]) prefixes.push({ _id: null, type: 'prefix', data: 'hm!' });
        const prefix = prefixes.find((p) => message.content.startsWith(p.data as string))?.data as string;
        if (prefix === undefined) return;
        prefixCommand(message, prefix, message.client);
    },
});
