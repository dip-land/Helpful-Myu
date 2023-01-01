import type { Message } from 'discord.js';
import { Counter, type CounterInterface } from './database/mongo.js';

export type Channels = Array<{ channel: string; emojis: Array<string>; msgs: Array<string>; t: number; d: boolean }>;

const channels: Channels = [
    { channel: '690972955080917085', emojis: ['<a:akafeheart:1009602965616726026>'], msgs: ["❕>w< w-where's the cute~?? Post more cute~!"], t: 8, d: false }, //KK_tea-room
    { channel: '1054475329776926830', emojis: ['<a:akafeheart:1009602965616726026>'], msgs: ["❕>w< w-where's the cute~?? Post more cute~!"], t: 10, d: false }, //KK_extra-cute
    { channel: '1054471487119179886', emojis: ['<a:akafeheart:1009602965616726026>'], msgs: ["❕>w< w-where's the cute~?? Post more cute~!"], t: 10, d: false }, //KK_super-cute
    { channel: '995368611822706708', emojis: ['💖'], msgs: ['>:('], t: 0, d: true }, //SB_msgblocktest
    {
        channel: '960560813637255189',
        emojis: [
            '<a:akafeheart:1009602965616726026>',
            '<:cocsmile:960630832219971624>',
            '<:chopain:960614470940504075>',
            '<:cindizzy:960630695464669214>',
            '<:mapmad:960614761349935134>',
        ],
        msgs: ['Nyuuu~ no tyext in the meme channel~! >w<', 'Bakaa customer~, read the channel descwiption~! >w>', 'Nyaaa~! Memes only means memes onlyy~ >w>'],
        t: 0,
        d: true,
    }, //KK_memes-only
];

export default async (message: Message<boolean>) => {
    const channel = channels.find(({ channel }) => channel === message.channelId);
    if (!channel || message.channel.type !== 0 || !message?.id) return;
    let counter = (await Counter.findOne({ id: message.channelId })) as CounterInterface;
    if (counter === null) {
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
            if (
                content.startsWith('https://tenor.com/view/') ||
                content.startsWith('https://www.reddit.com/') ||
                content.startsWith('https://twitter.com/') ||
                content.startsWith('https://vxtwitter.com/') ||
                content.match(/^(https?:\/\/)?((www\.)?youtube\.com|youtu\.be)\/.+$/g)
            ) {
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
            Counter.findOneAndUpdate({ id: message.channelId }, { $set: { count: counter.count++ } });
            if (counter.count >= channel.t) {
                message.channel.send(channel.msgs[Math.floor(Math.random() * channel.msgs.length)]).then((msg) => {
                    setTimeout(() => {
                        msg.delete().catch((err: Error) => {});
                    }, 30000);
                });
                if (channel.d && message.deletable) {
                    message.delete().catch((err: Error) => {});
                }
            }
        }
    }
};

function finish(message: Message<boolean>, channel: Channels[0]) {
    if (message.channel.type !== 0) return;
    if (!message?.id) return;
    Counter.findOneAndUpdate({ id: message.channelId }, { $set: { count: 0 } });
    for (const emoji of channel.emojis) {
        message.react(emoji).catch((err: Error) => console.log('error reacting to a message'));
    }
}
