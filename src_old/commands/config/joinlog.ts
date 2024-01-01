import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../structures/command.js';
import { Config } from '../../handlers/database/mongo.js';

export default new Command({
    name: 'joinlog',
    description: 'Set, Update, View or Remove join log channel',
    options: [
        {
            name: 'set',
            description: 'Set join log channel',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The channel you want to set as the join log',
                    type: ApplicationCommandOptionType.Channel,
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.Boolean,
                    name: 'hide',
                    description: 'Hide the response',
                },
            ],
        },
        {
            name: 'remove',
            description: 'Remove join log channel',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    type: ApplicationCommandOptionType.Boolean,
                    name: 'hide',
                    description: 'Hide the response',
                },
            ],
        },
        {
            name: 'view',
            description: 'Displays current join log channel',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    type: ApplicationCommandOptionType.Boolean,
                    name: 'hide',
                    description: 'Hide the response',
                },
            ],
        },
    ],
    aliases: [],
    category: 'config',
    default_member_permissions: '8',
    permissions: ['Administrator'],
    async slashCommand(interaction, options) {
        const channel = options.get('channel')?.channel;

        if (options.getSubcommand() === 'set') {
            const existingConfig = await Config.findOne({ type: 'joinLog' });
            if (existingConfig) {
                Config.updateOne({ type: 'joinLog' }, { $set: { data: channel?.id as string } });
                interaction.editReply(`join log channel <#${channel?.id}> has been updated.`);
            } else {
                Config.insertOne({ type: 'joinLog', data: channel?.id as string });
                interaction.editReply(`join log channel <#${channel?.id}> has been set.`);
            }
        } else if (options.getSubcommand() === 'remove') {
            const existingConfig = await Config.findOne({ type: 'joinLog' });
            if (!existingConfig) {
                interaction.editReply('There currently is no join log channel set up, please use the joinlog set subcommand to set a joinlog channel.');
            } else {
                Config.deleteOne({ type: 'joinLog' });
                interaction.editReply(`join log channel <#${existingConfig.data}> config has been deleted.`);
            }
        } else if (options.getSubcommand() === 'view') {
            const existingConfig = await Config.findOne({ type: 'joinLog' });
            if (!existingConfig) {
                interaction.editReply('There currently is no join log channel set up, please use the joinlog set subcommand to set a joinlog channel.');
            } else {
                interaction.editReply(`The current join log channel is <#${existingConfig.data}>`);
            }
        }
    },
    async prefixCommand(message, args) {
        const id = args[1] ? args[1].replace('<#', '').replace('>', '') : '';
        const channel = await message.client.channels.fetch(id, { force: true }).catch((err: Error) => {});
        if (args[0] === 'set') {
            const existingConfig = await Config.findOne({ type: 'joinLog' });
            if (existingConfig) {
                if (!channel) return message.reply(`Channel \`${id}\` does not exist.`);
                Config.updateOne({ type: 'joinLog' }, { $set: { data: id } });
                message.reply(`join log channel ${id} has been updated.`);
            } else {
                if (!channel) return message.reply(`Channel \`${id}\` does not exist.`);
                Config.insertOne({ type: 'joinLog', data: id });
                message.reply(`join log channel ${id} has been set.`);
            }
        } else if (args[0] === 'remove') {
            const existingConfig = await Config.findOne({ type: 'joinLog' });
            if (!existingConfig) {
                message.reply('There currently is no join log channel set up, please use the joinlog set subcommand to set a joinlog channel.');
            } else {
                Config.deleteOne({ type: 'joinLog' });
                message.reply(`join log channel ${id} config has been deleted.`);
            }
        } else if (args[0] === 'view') {
            const existingConfig = await Config.findOne({ type: 'joinLog' });
            if (!existingConfig) {
                message.reply('There currently is no join log channel set up, please use the joinlog set subcommand to set a joinlog channel.');
            } else {
                message.reply(`The current join log channel is <#${existingConfig.data}>`);
            }
        } else {
            message.reply(
                'Setting the join log channel with slash commands type `/joinlog set channel: <channel>`, with prefix commands type `<prefix>joinlog set <channel>`\nRemoving the join log channel with slash commands type `/joinlog remove channel: <channel>`, with prefix commands type `<prefix>joinlog remove <channel>`\nView the join log channel with slash commands type `/joinlog view`, with prefix commands type `<prefix>joinlog view`'
            );
        }
    },
});
