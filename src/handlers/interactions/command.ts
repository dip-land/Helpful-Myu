import type { CommandInteraction } from 'discord.js';
import type { Command } from '../../structures/command.js';

export default async (interaction: CommandInteraction) => {
	const command = interaction.client.legacyCommands.get(interaction.commandName) as Command;
	const hidden = !!interaction.options.data.find((option) => option.name === 'hide')?.value;
	await interaction.deferReply({ ephemeral: hidden });
	//permissions check
	if (interaction.user.id !== '439039443744063488') {
		if (command.commandObject.permissions) {
			for (const permission of command.commandObject.permissions) {
				if (interaction.memberPermissions && interaction.memberPermissions.has(permission)) return interaction.editReply('You seem to be missing permissions to use this command.');
			}
		}
		if (command.commandObject?.disabled) return interaction.editReply('This command is currently disabled.');
	}

	try {
		command.slashCommand(interaction, interaction.options.data);
	} catch (error) {
		console.log(error);
	}
};
