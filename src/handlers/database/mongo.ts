import type { ObjectId, Collection } from 'mongodb';
import glob from 'glob';
import { beta, client, mongoClient } from '../../index.js';
import importData from './import.js';

await mongoClient.connect();
mongoClient.on('connectionReady', () => console.log('Database Online'));
const database = mongoClient.db(beta ? 'MB' : 'HM');

glob('./data/imports/*.json', async (err: Error | null, paths: Array<string>) => {
    for (const path of paths) {
        importData(path, false);
    }
});

export const Config: Collection<ConfigInterface> = database.collection('Config');

export interface ConfigInterface {
    _id?: ObjectId | null;
    type: 'prefix' | 'channel';
    data: string | ChannelConfigInterface;
}

export interface ChannelConfigInterface {
    channel: string;
    emojis: Array<string>;
    messages: Array<string>;
    allowedUrls: Array<string>;
    maxMessages: number;
    deleteAtMax: boolean;
}

export const Counter: Collection<CounterInterface> = database.collection('Counters');

export interface CounterInterface {
    _id?: ObjectId | null;
    id: string;
    count: number;
}

export const User: Collection<UserInterface> = database.collection('Users');

export interface UserInterface {
    _id?: ObjectId | null;
    id: string;
    xp: number;
    level: number;
    money: number;
}

export const Queue: Collection<QueueInterface> = database.collection('Queues');

export interface QueueInterface {
    _id?: ObjectId | null;
    url: string;
    platform: string;
    duration: number;
    currentDuration: number;
}

export const Quote: Collection<QuoteInterface> = database.collection('Quotes');

export interface QuoteInterface {
    _id?: ObjectId | null;
    id: string;
    keyword: string;
    text: string;
    createdBy: string;
    createdAt: Date;
}

export async function QuoteCreated(quote: QuoteInterface) {
    const channelID = beta ? '1002785897005199480' : '1004144428019097600';
    const channel = await client.channels.fetch(channelID).catch((e) => {});
    const createdBy = await client.users.fetch(quote.createdBy);
    if (channel && channel?.isTextBased()) {
        channel.send({
            content: `\`Quote ${quote.id}  Keyword: ${quote.keyword}\` ${quote.text}\n\n<t:${Math.floor(quote.createdAt.getTime() / 1000)}:F>\nCreated by ${createdBy.tag} (${
                createdBy.id
            })`,
        });
    }
}

export async function QuoteDeleted(quote: QuoteInterface) {
    const channelID = beta ? '1002785897005199480' : '1004144428019097600';
    const channel = await client.channels.fetch(channelID).catch((e) => {});
    const createdBy = await client.users.fetch(quote.createdBy);
    if (channel && channel?.isTextBased()) {
        channel.send({
            content: `\`Quote ${quote.id} Deleted\` ${quote.text}\n\n<t:${Math.floor(Date.now() / 1000)}:F>\nCreated by ${createdBy.tag} (${createdBy.id})`,
        });
    }
}
