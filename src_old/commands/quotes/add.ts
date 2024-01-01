import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../structures/command.js';
import { Quote, QuoteCreated } from '../../handlers/database/mongo.js';
import { client } from '../../index.js';

export default new Command({
    name: 'quoteadd',
    description: 'Create a quote',
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: 'keyword',
            description: 'The quotes keyword',
            required: true,
        },
        {
            type: ApplicationCommandOptionType.String,
            name: 'text',
            description: 'The quotes content',
            required: true,
        },
        {
            type: ApplicationCommandOptionType.Boolean,
            name: 'hide',
            description: 'Hide the response',
        },
    ],
    aliases: ['qa', 'qadd'],
    category: 'quotes',
    cooldown: 10,
    async slashCommand(interaction, options) {
        try {
            const keyword = options.getString('keyword', true).toLowerCase().replace(' ', '_');
            const text = options.getString('text', true);
            const id = keyword + ((await Quote.countDocuments({ keyword })) + 1);
            Quote.insertOne({ id, keyword: keyword, text, createdBy: interaction.user.id, createdAt: new Date() }).then(() => {
                Quote.findOne({ id }).then((q) => {
                    if (q) {
                        QuoteCreated(q);
                        interaction.editReply(`Quote ${q.id} cweated :3`);
                    }
                });
            });
        } catch (err) {
            console.log(client.timeCode('error'), err);
        }
    },
    async prefixCommand(message, args) {
        if (!args[0]) return message.reply('Nyu keyword or text provided miyaaaa~!');
        const keyword = args.shift() as string;
        if (!args[0]) return message.reply('Nyow add the text desu~!');
        const id = keyword + ((await Quote.countDocuments({ keyword })) + 1);
        Quote.insertOne({ id, keyword: keyword.toLowerCase(), text: args.join(' '), createdBy: message.author.id, createdAt: new Date() }).then(() => {
            Quote.findOne({ id }).then((q) => {
                if (q) {
                    QuoteCreated(q);
                    message.reply(`Quote ${q.id} cweated :3`);
                }
            });
        });
    },
});
