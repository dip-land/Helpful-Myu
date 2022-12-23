import type { User, Client } from 'discord.js';
import { Command } from '../../structures/command.js';

export default new Command({
	name: 'help',
	description: 'Get some help :3',
	options: [
		{
			type: 3,
			name: 'query',
			description: 'Command you want to search for',
		},
		{
			type: 5,
			name: 'hide',
			description: 'Hide the response',
		},
	],
	aliases: ['commands', 'cmds'],
	category: 'utility',
	async slashCommand(interaction, options) {
		const query: string | number = options.find((option) => option.name === 'query')?.value as string;
		if (!query) {
			interaction.editReply({
				embeds: [
					{
						color: 0xfab6ec,
						title: 'Help',
						description: makeDefaultText(interaction.client, true),
						timestamp: new Date().toISOString(),
						footer: {
							text: `Requested by ${interaction.user.tag}`,
							icon_url: interaction.user.displayAvatarURL(),
						},
					},
				],
			});
		} else {
			interaction.editReply({
				embeds: [makeCommandEmbed(query, interaction.client, interaction.user)],
			});
		}
	},
	async prefixCommand(message, args) {
		if (!args[0]) {
			message.reply({
				embeds: [
					{
						color: 0xfab6ec,
						title: 'Help',
						description: makeDefaultText(message.client, false),
						timestamp: new Date().toISOString(),
						footer: {
							text: `Requested by ${message.author.tag}`,
							icon_url: message.author.displayAvatarURL(),
						},
					},
				],
			});
		} else {
			message.reply({
				embeds: [makeCommandEmbed(args[0], message.client, message.author)],
			});
		}
	},
});

function makeDefaultText(client: Client, slash: boolean) {
	const config: Array<string> = [];
	const music: Array<string> = [];
	const quotes: Array<string> = [];
	const utility: Array<string> = [];
	const commands = client.legacyCommands;
	for (const collection of commands) {
		const cmdObj = collection[1].commandObject;
		if (cmdObj.category === 'config' && !config.includes(cmdObj.name)) {
			config.push(cmdObj.name);
			if (cmdObj.aliases[0]) config.push(cmdObj.aliases.join(', '));
		} else if (cmdObj.category === 'music' && !music.includes(cmdObj.name)) {
			music.push(cmdObj.name);
			if (cmdObj.aliases[0]) music.push(cmdObj.aliases.join(', '));
		} else if (cmdObj.category === 'quotes' && !quotes.includes(cmdObj.name)) {
			quotes.push(cmdObj.name);
			if (cmdObj.aliases[0]) quotes.push(cmdObj.aliases.join(', '));
		} else if (cmdObj.category === 'utility' && !utility.includes(cmdObj.name)) {
			utility.push(cmdObj.name);
			if (cmdObj.aliases[0]) utility.push(cmdObj.aliases.join(', '));
		}
	}
	return `**Here are all the different commands. \n\nConfig:** ${config.join(', ')}\n**Music:** ${music.join(', ')}\n**Quotes:** ${quotes.join(', ')}\n**Utility:** ${utility.join(
		', '
	)}\n\n **To see the details of a specific command type \`${slash === true ? '/help query:[command name]' : '.help [command name]'}\`**`;
}

function makeCommandEmbed(query: string, client: Client, user: User) {
	const command = client.legacyCommands.find((command) => command.commandObject.name === query || command.commandObject.aliases.includes(query));
	console.log(command?.commandObject.name);
	return {
		color: 0xfab6ec,
		title: 'Help',
		description: 'This bit of the command is still a work in progress!!',
		timestamp: new Date().toISOString(),
		footer: {
			text: `Requested by ${user.tag}`,
			icon_url: user.displayAvatarURL(),
		},
	};
}
