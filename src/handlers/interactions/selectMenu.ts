import type { AnySelectMenuInteraction } from 'discord.js';
import type { Command } from '../../structures/command.js';

export default async (interaction: AnySelectMenuInteraction) => {
    const args = interaction.customId.split('_');
    const commandName = args[0];
    const command = interaction.client.legacyCommands.get(commandName) as Command;
    const message = args[2] === 'i' ? undefined : await interaction.channel?.messages.fetch(args[2]);
    if (args[1] !== interaction.user.id) interaction.reply({ content: 'Only command initiator can use this select menu.', ephemeral: true });
    if (!command?.commandObject) return;
    command.selectMenu(interaction, message, args).catch((e) => {});
};
