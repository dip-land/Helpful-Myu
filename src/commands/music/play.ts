import type { Guild } from 'discord.js';
import { Command } from '../../structures/command.js';
import { queueAdd } from '../../handlers/musicState.js';

export default new Command({
	name: 'play',
	description: 'Play a song',
	options: [
		{
			type: 3,
			name: 'query',
			description: 'The song link or name',
			required: true,
		},
		{
			type: 5,
			name: 'hide',
			description: 'Hide the response',
		},
	],
	aliases: ['p'],
	category: 'music',
	cooldown: 0.1,
	async slashCommand(interaction, options) {
		try {
			const query = `${options.find((option) => option.name === 'query')?.value}`;
			if (!interaction.member?.voice.channel) return interaction.editReply('Pwease connect to a voice channel first >~<');
			queueAdd(query, interaction.member?.voice.channelId as string, interaction.guild as Guild);
		} catch (error) {
			console.log(error);
		}
	},
	async prefixCommand(message, args) {
		if (!args[0]) return;
		if (!message.member?.voice.channel) return message.reply('Pwease connect to a voice channel first >~<');
		queueAdd(args[0], message.member?.voice.channelId as string, message.guild as Guild);
	},
});
