import type { AnySelectMenuInteraction } from 'discord.js';
import type { Command } from '../../structures/command.js';

export default async (interaction: AnySelectMenuInteraction) => {
    const args = interaction.customId.split('_');
    if (interaction.channel?.type !== 0) return interaction.reply({ content: 'This can only be used in a guild text channel.' });
    if (args[1] !== interaction.user.id) interaction.reply({ content: 'Only command initiator can use this select menu.', ephemeral: true });
    const command = interaction.client.legacyCommands.get(args[0]) as Command;
    const message = args[2] === 'i' ? undefined : await interaction.channel?.messages.fetch(args[2]);
    if (!command || !command.selectMenu) return;
    command.selectMenu(interaction, message, args).catch((err: Error) => {});
};
