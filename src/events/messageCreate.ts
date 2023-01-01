import type { Message } from 'discord.js';
import prefixCommand from '../handlers/prefixCommand.js';
import { Config } from '../handlers/database/mongo.js';
import messageFilter from '../handlers/messageFilter.js';
import { Event } from '../structures/event.js';

let prefixes = await Config.find({ type: 'prefix' }).toArray();
export async function fetchPrefixes() {
    prefixes = await Config.find({ type: 'prefix' }).toArray();
    console.log('Prefixes Updated.');
}

export default new Event({
    name: 'messageCreate',
    on: true,
    async fn(message: Message<boolean>) {
        if (message.author.bot) return;
        if (message.member?.displayName.toLowerCase().includes('mouse') && Math.ceil(Math.random() * 49) === 42) message.channel.send('🧀');
        if (message.content.toLowerCase().includes('stfu')) message.channel.send('slice the fudge, uwuu~ <3');
        messageFilter(message);

        if (!prefixes[0]) prefixes.push({ _id: null, type: 'prefix', data: 'hm!' });
        const prefix = prefixes.find((p) => message.content.startsWith(p.data as string))?.data as string;
        if (prefix === undefined) return;
        prefixCommand(message, prefix, message.client);
    },
});
