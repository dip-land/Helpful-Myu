import type { ButtonInteraction } from 'discord.js';
import type { Command } from '../../structures/command.js';

export default async (interaction: ButtonInteraction) => {
    const args = interaction.customId.split('_');
    if (interaction.channel?.type !== 0) return interaction.reply({ content: 'This can only be used in a guild text channel.' });
    if (args[1] !== interaction.user.id) return interaction.reply({ content: 'Only command initiator can use these buttons.', ephemeral: true });
    const message = args[2] === 'i' ? undefined : await interaction.channel?.messages.fetch(args[2]);
    if (args[0] === 'cancel') {
        interaction.reply({ content: 'Command canceled.', ephemeral: true }).catch((err: Error) => {});
        interaction.message.delete().catch((err: Error) => {});
        message?.delete().catch((err: Error) => {});
    } else {
        const command = interaction.client.legacyCommands.get(args[0]) as Command;
        if (!command || !command.button) return;
        command.button(interaction, message, args).catch((err: Error) => {});
    }
};
