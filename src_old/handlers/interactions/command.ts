import { type ChatInputCommandInteraction } from 'discord.js';
import type { Command } from '../../structures/command.js';
import { client } from '../../index.js';

export default async (interaction: ChatInputCommandInteraction) => {
    const command = interaction.client.legacyCommands.get(interaction.commandName) as Command;
    const hidden = !!interaction.options.get('hide')?.value;
    if (!command.slashCommand) return;

    if (command?.commandObject?.permissions) {
        for (const permission of command.commandObject.permissions) {
            if (interaction.memberPermissions && !interaction.memberPermissions.has(permission))
                return interaction.editReply('You seem to be missing permissions to use this command.');
        }
    }
    if (command?.commandObject?.disabled) return interaction.editReply('This command is currently disabled.');
    if (command?.commandObject?.beta && !client.beta) return interaction.editReply("This command isn't supposed to be here");

    if (command.commandObject.defered === true) {
        await interaction.deferReply({ ephemeral: hidden });
        command.slashCommand(interaction, interaction.options).catch((err: Error) => console.log(client.timeCode('error'), err));
    } else {
        command.slashCommand(interaction, interaction.options).catch((err: Error) => console.log(client.timeCode('error'), err));
    }
};
