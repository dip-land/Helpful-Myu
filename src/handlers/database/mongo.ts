import type { ObjectId, Collection } from 'mongodb';
import { version, client, mongoClient, timeCode } from '../../index.js';
import importData from './import.js';
import { readdir } from 'fs/promises';
import path from 'path';

await mongoClient.connect();
const database = mongoClient.db(version === 'beta' ? 'MB' : version.toUpperCase());

mongoClient.on('error', (err) => {
    console.log(timeCode('error'), err);
});

const files = await readdir('./data/imports/');
for (const file of files) importData(path.join('./data/imports/', file), false);

export const Config: Collection<ConfigInterface> = database.collection('Config');

export interface ConfigInterface {
    _id?: ObjectId | null;
    type: 'quoteLog' | 'channel' | 'prefix' | 'joinLog' | 'leaveLog';
    data: string | MessageFilterConfigInterface;
}

export interface MessageFilterConfigInterface {
    channel: string;
    emojis: Array<string>;
    messages: Array<string>;
    allowedUrls: Array<string>;
    maxMessages: number;
    deleteAtMax: boolean;
    bypassUsers?: Array<string> | undefined;
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
    const channelID = (await Config.findOne({ type: 'quoteLog' }))?.data as string | undefined;
    if (!channelID) return;
    const channel = await client.channels.fetch(channelID).catch((err: Error) => {});
    const createdBy = await client.users.fetch(quote.createdBy);
    if (channel && channel?.isTextBased() && channel.type === 0) {
        channel.send({
            content: `\`Quote ${quote.id}  Keyword: ${quote.keyword}\` ${quote.text}\n\n<t:${Math.floor(quote.createdAt.getTime() / 1_000)}:F>\nCreated by ${createdBy.tag} (${
                createdBy.id
            })`,
        });
    }
}

export async function QuoteDeleted(quote: QuoteInterface) {
    const channelID = (await Config.findOne({ type: 'quoteLog' }))?.data as string | undefined;
    if (!channelID) return;
    const channel = await client.channels.fetch(channelID).catch((err: Error) => {});
    const createdBy = await client.users.fetch(quote.createdBy);
    if (channel && channel?.isTextBased() && channel.type === 0) {
        channel.send({
            content: `\`Quote ${quote.id} Deleted\` ${quote.text}\n\n<t:${Math.floor(Date.now() / 1_000)}:F>\nCreated by ${createdBy.tag} (${createdBy.id})`,
        });
    }
}

export const Reaction: Collection<ReactionInterface> = database.collection('Reaction');

export interface ReactionInterface {
    _id?: ObjectId | null;
    message: string;
    emojis: Array<string>;
    roles: Array<string>;
    requiredRole: string | null;
    numberOfRoles: number;
    groupedMessages: Array<string>;
}
