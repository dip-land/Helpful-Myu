import { connect, model, type ObjectId, Schema } from 'mongoose';
import { client } from '../../index.js';
import { type APIEmbed } from 'discord.js';
import { Tenor } from '../../classes/Tenor.js';

await connect(process.env.MONGOURI, { dbName: 'Database' }).catch((err) => console.log(err));
const quoteChartLink = {
    hm: 'https://charts.mongodb.com/charts-project-0-nodkw/dashboards/63ab7feb-b222-4006-8436-6652df38b81b',
    nm: 'https://charts.mongodb.com/charts-project-0-nodkw/dashboards/63b13d45-17c1-4d31-8281-250151641181',
    undefined: 'https://charts.mongodb.com/charts-project-0-nodkw/dashboards/647f7844-23c6-4905-83ac-74915d6106cf',
}[process.argv[2]];
const getExtension = (url: string) => {
    return url.split(/[#?]/)[0].split('.').pop()?.trim() || '';
};

const configSchema = new Schema({
    guild: { type: String, required: true },
    quoteLog: { type: String, default: '' },
    joinLog: { type: String, default: '' },
    leaveLog: { type: String, default: '' },
    levelLog: { type: String, default: '' },
    boostImage: { type: String, default: '' },
    boostChannel: { type: String, default: '' },
    boostMessage: { type: String, default: '' },
    joinImage: { type: String, default: '' },
    joinChannel: { type: String, default: '' },
    joinMessage: { type: String, default: '' },
    prefixes: { type: [String], default: ['.'] },
});
export interface IConfig {
    guild: string;
    quoteLog: string;
    joinLog: string;
    leaveLog: string;
    levelLog: string;
    boostImage: string;
    boostChannel: string;
    boostMessage: string;
    joinImage: string;
    joinChannel: string;
    joinMessage: string;
    prefixes: Array<string>;
}
export type TConfigChannel = 'quoteLog' | 'joinLog' | 'leaveLog' | 'levelLog' | 'boostChannel' | 'joinChannel';
export type TConfigImage = 'boostImage' | 'joinImage';
export type TConfigMessage = 'boostMessage' | 'joinMessage';
export const Config = model('Config', configSchema);

const messageFilterSchema = new Schema({
    guild: { type: String, required: true },
    channel: { type: String, required: true },
    emojis: [String],
    messages: [String],
    allowedURLs: [String],
    maxMessages: Number,
    mediaOnly: Boolean,
    delete: Boolean,
    bypassUsers: [String],
});
export const MessageFilter = model('MessageFilter', messageFilterSchema);

const quoteSchema = new Schema({
    guild: { type: String, required: true },
    count: { type: Number },
    id: { type: String, default: '' },
    keyword: { type: String, required: true },
    text: { type: String, required: true },
    links: { type: [String], default: [''] },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: new Date() },
    deleted: { type: Boolean, default: false },
});
quoteSchema.pre('save', async function (next) {
    this.count = (await this.collection.countDocuments({ guild: this.guild })) + 1;
    this.id = this.keyword + ((await this.collection.countDocuments({ guild: this.guild, keyword: this.keyword })) + 1);
    const parsed: string[] = [];
    for (const content of this.text.split(' ')) {
        if (content.startsWith('https://tenor.com/view')) {
            parsed.push((await new Tenor().posts(content.split('-').splice(-1)[0])).result.media_formats.gif.url);
            continue;
        }
        if (content.startsWith('http') && /(gif|jpe?g|png|webp)/gi.test(getExtension(content))) parsed.push(content);
    }
    this.links = parsed;
    next();
});
quoteSchema.post(/save|update/gi, async function (quote, next) {
    const channel = await client.channels.fetch((await Config.findOne({ guild: quote.guild }))?.quoteLog as string).catch((err: Error) => {});
    if (!channel || !channel?.isTextBased() || channel.type !== 0) return;
    const createdBy = await client.users.fetch(quote.createdBy);
    const embeds: Array<APIEmbed> = [];
    const links = quote.links[0] ? quote.links : [''];
    for (const link in links) {
        embeds.push({
            url: `${quoteChartLink}#:~:text=${quote.id}`,
            title: `Quote #${quote._id} ${quote.deleted ? 'Deleted' : 'Created'}`,
            image: { url: isNaN(parseInt(link)) ? link : links[link] },
            description: `ID: ${quote.id}\nKeyword: ${quote.keyword}\nContent: ${quote.text}`,
            color: quote.deleted ? undefined : client.embedColor,
            footer: { icon_url: createdBy.avatarURL() || undefined, text: `${createdBy.username} (${createdBy.id})` },
            timestamp: quote.createdAt.toISOString(),
        });
    }
    channel.send({ embeds });
    next();
});

export const Quote = model('Quote', quoteSchema);
