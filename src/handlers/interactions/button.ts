import type { ButtonInteraction } from 'discord.js';
import type { Command } from '../../structures/command.js';

export default async (interaction: ButtonInteraction) => {
	const args = interaction.customId.split('_');
	const commandName = args[0];
	const command = interaction.client.legacyCommands.get(commandName) as Command;
	const message = args[2] === 'i' ? undefined : await interaction.channel?.messages.fetch(args[2]);
	if (args[1] !== interaction.user.id) interaction.reply({ content: 'Only command initiator can use these buttons.', ephemeral: true });
	if (commandName === 'cancel') {
		interaction.reply({ content: 'Command canceled.', ephemeral: true }).catch((e) => {});
		interaction.message.delete().catch((e) => {});
		message?.delete().catch((e) => {});
		return;
	}
	if (!command?.commandObject) return;
	command.button(interaction, message, args).catch((e) => {});
};
