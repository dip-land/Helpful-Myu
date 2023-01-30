import type { Message, ThreadChannel } from 'discord.js';
import { type ChannelConfigInterface, Counter, type CounterInterface, Config } from './database/mongo.js';

let channels = (await Config.find({ type: 'channel' }).toArray()).map((conf) => conf.data) as Array<ChannelConfigInterface>;
export async function fetchChannelConfigs() {
    channels = (await Config.find({ type: 'channel' }).toArray()).map((conf) => conf.data) as Array<ChannelConfigInterface>;
}

export default async (message: Message<boolean>) => {
    let channel = channels.find(({ channel }) => channel === message.channelId);
    if (!channel && message.channel.isThread()) channel = channels.find(({ channel }) => channel === (message.channel as ThreadChannel).parentId);
    if (!channel || !message.channel.type.toString().match(/0|11/g) || !message?.id) return;
    let counter = (await Counter.findOne({ id: message.channelId })) as CounterInterface;
    if (!counter) {
        Counter.insertOne({ id: message.channelId, count: 0 });
        counter = (await Counter.findOne({ id: message.channelId })) as CounterInterface;
    }
    if (message.attachments.size > 0) {
        const checks: Array<number> = [];
        for (const [s, attachment] of message.attachments) {
            if (attachment.contentType?.match(/video\/|image\//g)) checks.push(1);
            else checks.push(0);
        }
        if (!checks.includes(0)) return finish(message, channel);
    }
    if (message.content) {
        const contents = message.content.split(' ');
        const checks: Array<number> = [];
        for (const content of contents) {
            if (channel.allowedUrls.includes(content)) {
                checks.push(1);
            } else if (content.startsWith('http')) {
                const data = await fetch(content, { method: 'HEAD' }).catch((err: Error) => {});
                if (data) {
                    const type = data.headers.get('content-type');
                    if (type?.match(/video\/|image\//g)) checks.push(1);
                    else checks.push(0);
                }
            }
        }
        if (!checks.includes(0) && checks.length > 0) return finish(message, channel);
        else {
            Counter.updateOne({ id: message.channelId }, { $set: { count: counter.count + 1 } });
            if (counter.count >= channel.maxMessages) {
                if (channel.messages[0]) {
                    message.channel.send(channel.messages[Math.floor(Math.random() * channel.messages.length)]).then((msg) => {
                        setTimeout(() => {
                            msg.delete().catch((err: Error) => {});
                        }, 30000);
                    });
                }
                if (channel.deleteAtMax && message.deletable) {
                    message.delete().catch((err: Error) => {});
                }
            }
        }
    }
};

function finish(message: Message<boolean>, channel: ChannelConfigInterface) {
    Counter.updateOne({ id: message.channelId }, { $set: { count: 0 } });
    for (const emoji of channel.emojis) {
        message.react(emoji).catch((err: Error) => console.log('error reacting to a message'));
    }
}
