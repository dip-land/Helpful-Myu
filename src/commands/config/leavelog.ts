import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../structures/command.js';
import { Config } from '../../handlers/database/mongo.js';

export default new Command({
    name: 'leavelog',
    description: 'Set, Update, View or Remove leave log channel',
    options: [
        {
            name: 'set',
            description: 'Set leave log channel',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The channel you want to set as the leave log',
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
            description: 'Remove leave log channel',
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
            description: 'Displays current leave log channel',
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
            const existingConfig = await Config.findOne({ type: 'leaveLog' });
            if (existingConfig) {
                Config.updateOne({ type: 'leaveLog' }, { $set: { data: channel?.id as string } });
                interaction.editReply(`leave log channel <#${channel?.id}> has been updated.`);
            } else {
                Config.insertOne({ type: 'leaveLog', data: channel?.id as string });
                interaction.editReply(`leave log channel <#${channel?.id}> has been set.`);
            }
        } else if (options.getSubcommand() === 'remove') {
            const existingConfig = await Config.findOne({ type: 'leaveLog' });
            if (!existingConfig) {
                interaction.editReply('There currently is no leave log channel set up, please use the leavelog set subcommand to set a leavelog channel.');
            } else {
                Config.deleteOne({ type: 'leaveLog' });
                interaction.editReply(`leave log channel <#${existingConfig.data}> config has been deleted.`);
            }
        } else if (options.getSubcommand() === 'view') {
            const existingConfig = await Config.findOne({ type: 'leaveLog' });
            if (!existingConfig) {
                interaction.editReply('There currently is no leave log channel set up, please use the leavelog set subcommand to set a leavelog channel.');
            } else {
                interaction.editReply(`The current leave log channel is <#${existingConfig.data}>`);
            }
        }
    },
    async prefixCommand(message, args) {
        const id = args[1] ? args[1].replace('<#', '').replace('>', '') : '';
        const channel = await message.client.channels.fetch(id, { force: true }).catch((err: Error) => {});
        if (args[0] === 'set') {
            const existingConfig = await Config.findOne({ type: 'leaveLog' });
            if (existingConfig) {
                if (!channel) return message.reply(`Channel \`${id}\` does not exist.`);
                Config.updateOne({ type: 'leaveLog' }, { $set: { data: id } });
                message.reply(`leave log channel ${id} has been updated.`);
            } else {
                if (!channel) return message.reply(`Channel \`${id}\` does not exist.`);
                Config.insertOne({ type: 'leaveLog', data: id });
                message.reply(`leave log channel ${id} has been set.`);
            }
        } else if (args[0] === 'remove') {
            const existingConfig = await Config.findOne({ type: 'leaveLog' });
            if (!existingConfig) {
                message.reply('There currently is no leave log channel set up, please use the leavelog set subcommand to set a leavelog channel.');
            } else {
                Config.deleteOne({ type: 'leaveLog' });
                message.reply(`leave log channel ${id} config has been deleted.`);
            }
        } else if (args[0] === 'view') {
            const existingConfig = await Config.findOne({ type: 'leaveLog' });
            if (!existingConfig) {
                message.reply('There currently is no leave log channel set up, please use the leavelog set subcommand to set a leavelog channel.');
            } else {
                message.reply(`The current leave log channel is <#${existingConfig.data}>`);
            }
        } else {
            message.reply(
                'Setting the leave log channel with slash commands type `/leavelog set channel: <channel>`, with prefix commands type `<prefix>leavelog set <channel>`\nRemoving the leave log channel with slash commands type `/leavelog remove channel: <channel>`, with prefix commands type `<prefix>leavelog remove <channel>`\nView the leave log channel with slash commands type `/leavelog view`, with prefix commands type `<prefix>leavelog view`'
            );
        }
    },
});
