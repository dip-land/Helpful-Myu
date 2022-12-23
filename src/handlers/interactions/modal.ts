// import type { ModalSubmitInteraction } from 'discord.js';
// import type { Command } from '../../structures/command.js';

// This will be functioning code one day.

// this code is nonfunctioning and was copied and pasted from ./button.ts

// export default async (interaction: ModalSubmitInteraction) => {
// 	const args = interaction.customId.split('_');
// 	const commandName = args[0];
// 	const command = interaction.client.legacyCommands.get(commandName) as Command;

// 	let message = args[2] === 'i' ? undefined : await interaction.channel?.messages.fetch(args[2]);
// 	if (args[1] !== interaction.user.id) interaction.reply({ content: 'Only command initiator can use these buttons.', ephemeral: true });
// 	if (commandName === 'cancel') {
// 		interaction.reply({ content: 'Command canceled.', ephemeral: true }).catch((e) => {});
// 		interaction.message?.delete().catch((e) => {});
// 		message?.delete().catch((e) => {});
// 		return;
// 	}
// 	if (!command?.commandObject) return;
// 	command.modal(interaction, message, args).catch((e) => {});
// };
