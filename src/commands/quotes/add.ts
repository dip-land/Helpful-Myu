import { Command } from '../../structures/command.js';
import Quote from '../../structures/database/quote.js';

export default new Command({
	name: 'quoteadd',
	description: 'Create a quote',
	options: [
		{
			type: 3,
			name: 'keyword',
			description: 'The quotes keyword',
			required: true,
		},
		{
			type: 3,
			name: 'text',
			description: 'The quotes content',
			required: true,
		},
		{
			type: 5,
			name: 'hide',
			description: 'Hide the response',
		},
	],
	aliases: ['qa', 'qadd'],
	category: 'quotes',
	cooldown: 10,
	async slashCommand(interaction, options) {
		try {
			const keyword = `${options.find((option) => option.name === 'keyword')?.value}`.toLowerCase();
			const text = options.find((option) => option.name === 'text')?.value;
			new Quote({ keyword: keyword, text: text, createdBy: interaction.user.id }).save().then((q) => {
				interaction.editReply(`Quote #${q.id} cweated :3`);
			});
		} catch (error) {
			console.log(error);
		}
	},
	async prefixCommand(message, args) {
		if (!args[0]) return message.reply('Nyu keyword or text provided miyaaaa~!');
		const keyword = args.shift();
		if (!args[0]) return message.reply('Nyow add the text desu~!');
		new Quote({ keyword: keyword?.toLowerCase(), text: args.join(' '), createdBy: message.author.id }).save().then((q) => {
			message.reply(`Quote #${q.id} cweated :3`);
		});
	},
});
