import { type ChatInputCommandInteraction, Routes } from 'discord.js';
import type { Command } from '../../structures/command.js';

export default async (interaction: ChatInputCommandInteraction) => {
    const command = interaction.client.legacyCommands.get(interaction.commandName) as Command;
    const hidden = !!interaction.options.get('hide')?.value;
    await interaction.deferReply({ ephemeral: hidden });

    if (command?.commandObject?.permissions) {
        for (const permission of command.commandObject.permissions) {
            if (interaction.memberPermissions && !interaction.memberPermissions.has(permission))
                return interaction.editReply('You seem to be missing permissions to use this command.');
        }
    }
    if (command?.commandObject?.disabled) return interaction.editReply('This command is currently disabled.');

    try {
        command.slashCommand(interaction, interaction.options);
    } catch (err: Error | unknown) {
        console.log(err);
    }
};
