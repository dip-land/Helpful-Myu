import type { ModalSubmitInteraction } from 'discord.js';
import type { Command } from '../../structures/command.js';

export default async (interaction: ModalSubmitInteraction) => {
    const command = interaction.client.legacyCommands.get(interaction.customId) as Command;
    if (!command.modal) return;
    command.modal(interaction, interaction.fields.fields).catch((err: Error) => {});
};
