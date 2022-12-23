import { Command } from '../../structures/command.js';
import { ApplicationCommandOptionType } from 'discord.js';
import Quote from '../../structures/database/quote.js';

export default new Command({
	name: 'quote',
	description: 'Just some quotes',
	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: 'keyword',
			description: 'The quotes keyword',
			required: true,
		},
		{
			type: ApplicationCommandOptionType.Integer,
			name: 'number',
			description: 'Specfic quote from a keyword',
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
			const number = options.find((option) => option.name === 'number')?.value as number;
			const quotes = await Quote.findAll({ where: { keyword: keyword } });
			if (number > 0 && number <= quotes.length) {
				const chosen = quotes[number - 1];
				interaction.editReply(chosen?.text || 'Sempai~ that quote doesnt exist');
			} else {
				const chosen = quotes[Math.floor(Math.random() * quotes.length)];
				interaction.editReply(chosen?.text || 'This keyword has no quotes, sempai~');
			}
		} catch (error) {
			console.log(error);
		}
	},
	async prefixCommand(message, args) {
		if (!args[0]) return message.reply('You nyeed the keyword, desu~');
		const number = parseInt(args[1]);
		const quotes = await Quote.findAll({ where: { keyword: args[0].toLowerCase() } });
		if (number > 0 && number <= quotes.length) {
			const chosen = quotes[number - 1];
			message.channel.send(chosen?.text || 'Sempai~ that quote doesnt exist');
		} else {
			const chosen = quotes[Math.floor(Math.random() * quotes.length)];
			message.channel.send(chosen?.text || 'This keyword has no quotes, sempai~');
		}
	},
});
