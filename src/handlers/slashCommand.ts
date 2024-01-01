import type { ChatInputCommandInteraction, Collection } from 'discord.js';
import { client } from '../index.js';

export default async (interaction: ChatInputCommandInteraction) => {
    const cmd = client.slashCommands.get(interaction.commandName);
    const hidden = !!interaction.options.get('hide')?.value || false;
    if (!cmd || cmd.disabled || !cmd.slashCommand) return interaction.reply({ content: 'This command is disabled, it may be re-enabled in the future.', ephemeral: true });
    if (cmd.deferReply) await interaction.deferReply({ ephemeral: hidden });
    if (client.isShhh(interaction.user.id)) return cmd?.slashCommand({ interaction, hidden, options: interaction.options, client });

    const timestamps = client.cooldowns.get(cmd.name) as Collection<string, number>;
    const now = Date.now();
    if (timestamps.has(interaction.user.id)) {
        const expire = (timestamps.get(interaction.user.id) as number) + cmd.cooldown;
        if (now < expire) return interaction.reply(`Please wait \`${(expire - now) / 1_000}\` seconds before reusing the \`${cmd.name}\` command.`);
    }
    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cmd.cooldown);

    if (cmd.permissions) {
        for (const permission of cmd.permissions) {
            if (interaction.memberPermissions && !interaction.memberPermissions.has(permission))
                return interaction.reply('You seem to be missing permissions to use this command.');
        }
    }

    cmd.slashCommand({ interaction, hidden, options: interaction.options, client }).catch((err) => client.error(err));
};
