import type { APIEmbed, APIEmbedImage, Client, User } from 'discord.js';
import { Command } from '../../structures/command.js';
import { Quote, type QuoteInterface } from '../../handlers/database/mongo.js';

export default new Command({
    name: 'quotesearch',
    description: 'Search quote by ID or Keyword',
    options: [
        {
            type: 3,
            name: 'query',
            description: 'Keyword or ID you want to search',
            required: true,
        },
        {
            type: 5,
            name: 'hide',
            description: 'Hide the response',
        },
    ],
    aliases: ['qs', 'qsearch'],
    category: 'quotes',
    async slashCommand(interaction, options) {
        try {
            const query: string = options.find((option) => option.name === 'query')?.value as string;

            let quotes = await Quote.find({ id: query }).toArray();
            if (!quotes[0]) quotes = await Quote.find({ keyword: query }).toArray();
            const parsedQuotes = [];
            for (const quote of quotes) {
                parsedQuotes.push({
                    label: `ID: ${quote.id} Text:${quote.text.substring(0, 45)}`,
                    description: `${quote.text.substring(45, 145)}`,
                    value: `${quote.id}`,
                });
            }
            const quote = quotes[0];
            if (!quote) return interaction.editReply('This query has no quotes, sempai~');
            interaction.editReply({
                embeds: [await makeEmbed(quote, interaction.user, interaction.client)],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 3,
                                custom_id: `qs_${interaction.user.id}_${interaction.id}`,
                                options: parsedQuotes,
                                placeholder: 'Select a quote',
                            },
                        ],
                    },
                ],
            });
        } catch (e) {
            console.log(e);
        }
    },
    async prefixCommand(message, args) {
        if (!args[0]) return message.reply('Nyu query provided miyaaaa~!');
        let quotes = await Quote.find({ id: args[0].toLowerCase() }).toArray();
        if (!quotes[0]) quotes = await Quote.find({ keyword: args[0].toLowerCase() }).toArray();
        const parsedQuotes = [];
        for (const quote of quotes) {
            parsedQuotes.push({
                label: `ID: ${quote.id} Text:${quote.text.substring(0, 45)}`,
                description: `${quote.text.substring(45, 145)}`,
                value: `${quote.id}`,
            });
        }
        const quote = quotes[0];
        if (!quote) return message.reply('This query has no quotes, sempai~');
        message.reply({
            embeds: [await makeEmbed(quote, message.author, message.client)],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 3,
                            custom_id: `qs_${message.author.id}_${message.id}`,
                            options: parsedQuotes,
                            placeholder: 'Select a quote',
                        },
                    ],
                },
            ],
        });
    },
    async selectMenu(interaction) {
        interaction.deferUpdate();
        const quote = (await Quote.findOne({ id: interaction.values[0] })) as QuoteInterface;
        interaction.message.edit({
            embeds: [await makeEmbed(quote, interaction.user, interaction.client)],
        });
    },
});

async function makeEmbed(quote: QuoteInterface, user: User, client: Client): Promise<APIEmbed> {
    const createdBy = await client.users.fetch(quote.createdBy);
    const contents: Array<string> = quote.text.split(/[\n\r\s]+/);
    let image: APIEmbedImage | undefined;
    for (const content of contents) {
        if (content.startsWith('https://tenor.com/view/')) {
            const gif = (await fetch(`${content}.gif`, { redirect: 'follow' }).catch((e) => {})) as Response;
            image = { url: gif.url };
            break;
        } else {
            const data = await fetch(content, { method: 'HEAD' }).catch((e) => {});
            if (data) {
                const type = data.headers.get('content-type');
                if (type?.match(/video\/|image\/|webm/g)) {
                    image = { url: content };
                    break;
                }
            }
        }
    }
    return {
        color: 0xfab6ec,
        title: `Quote ${quote.id}`,
        description: `**Keyword:** ${quote.keyword}\n**Text:** ${quote.text}\n**Created By:** ${createdBy.tag} (${createdBy.id}) <t:${Math.floor(
            quote.createdAt.getTime() / 1000
        )}:R>\n`,
        image,
        timestamp: new Date().toISOString(),
        footer: {
            text: `Requested by ${user.tag}`,
            icon_url: user.displayAvatarURL(),
        },
    };
}
