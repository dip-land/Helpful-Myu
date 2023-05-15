import type { Message, ThreadChannel } from 'discord.js';
import { type MessageFilterConfigInterface, Counter, type CounterInterface, Config } from './database/mongo.js';
import { timeCode } from '../index.js';

let channels = (await Config.find({ type: 'channel' }).toArray()).map((conf) => conf.data) as Array<MessageFilterConfigInterface>;
export async function fetchChannelConfigs() {
    channels = (await Config.find({ type: 'channel' }).toArray()).map((conf) => conf.data) as Array<MessageFilterConfigInterface>;
}

export default async (message: Message<boolean>) => {
    const channel = channels.find(({ channel }) => channel === (message.channel.isThread() ? (message.channel as ThreadChannel).parentId : message.channelId));
    if (!channel || !message.channel.type.toString().match(/0|11/g) || !message?.id) return;
    let counter = (await Counter.findOne({ id: message.channelId })) as CounterInterface;
    if (!counter) {
        Counter.insertOne({ id: message.channelId, count: 0 });
        counter = (await Counter.findOne({ id: message.channelId })) as CounterInterface;
    }

    const checks: Array<number> = [];
    for (const [, attachment] of message.attachments) attachment.contentType?.match(/video\/|image\//g) ? checks.push(1) : checks.push(0);

    for (const content of message.content.split(' ')) {
        if (!content.startsWith('http')) continue;

        if (channel.allowedUrls.some((value) => new URL(content).origin.replace('www.', '').includes(value.replace(/\/$/, '')))) {
            checks.push(1);
            continue;
        }

        const data = await fetch(content, { method: 'HEAD' }).catch((err: Error) => {});
        data && data.headers.get('content-type')?.match(/video\/|image\//g) ? checks.push(1) : checks.push(0);
    }

    if (channel.bypassUsers && channel.bypassUsers.find((userID) => userID === message.author.id)) return finish(message, channel, true);
    if (!checks.includes(0) && checks.includes(1)) return finish(message, channel);
    else {
        Counter.updateOne({ id: message.channelId }, { $set: { count: counter.count + 1 } });
        if (counter.count >= channel.maxMessages && channel.messages[0] && message.channel.type === 0) {
            message.channel.send(channel.messages[Math.floor(Math.random() * channel.messages.length)]).then((msg) => {
                setTimeout(() => msg.delete().catch((err: Error) => {}), 30_000);
            });
        }
        if (channel.deleteAtMax && message.deletable) message.delete().catch((err: Error) => {});
    }
};

function finish(message: Message<boolean>, channel: MessageFilterConfigInterface, noReset?: boolean) {
    if (!noReset) Counter.updateOne({ id: message.channelId }, { $set: { count: 0 } });
    for (const emoji of channel.emojis) {
        message.react(emoji).catch((err: Error) => {
            if (err.message === 'Reaction blocked') return console.log(timeCode('error'), `${message.author.tag} has the bot blocked.`);
            return console.log(timeCode('error'), 'error reacting to a message', err);
        });
    }
}
