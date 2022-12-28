import { Command } from '../../structures/command.js';
import { ApplicationCommandOptionType } from 'discord.js';
import { Quote } from '../../handlers/database/mongo.js';

export default new Command({
    name: 'quote',
    description: 'Just some quotes',
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: 'query',
            description: 'The quotes keyword or id',
            required: true,
        },
        {
            type: 5,
            name: 'hide',
            description: 'Hide the response',
        },
    ],
    aliases: ['q'],
    category: 'quotes',
    async slashCommand(interaction, options) {
        try {
            const keyword = `${options.find((option) => option.name === 'keyword')?.value}`.toLowerCase();
            let quotes = await Quote.find({ id: keyword }).toArray();
            if (!quotes[0]) quotes = await Quote.find({ keyword: keyword }).toArray();

            const chosen = quotes[Math.floor(Math.random() * quotes.length)];
            interaction.editReply(chosen?.text || 'This query has no quotes, sempai~');
        } catch (error) {
            console.log(error);
        }
    },
    async prefixCommand(message, args) {
        if (!args[0]) return message.reply('You nyeed a query, desu~');
        const keyword = `${args[0]}`.toLowerCase();
        let quotes = await Quote.find({ id: keyword }).toArray();
        if (!quotes[0]) quotes = await Quote.find({ keyword: keyword }).toArray();

        const chosen = quotes[Math.floor(Math.random() * quotes.length)];
        message.channel.send(chosen?.text || 'This query has no quotes, sempai~');
    },
});
