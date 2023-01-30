import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../structures/command.js';
import { Config } from '../../handlers/database/mongo.js';

export default new Command({
    name: 'quotelog',
    description: 'Set, Update, View or Remove quote log channel',
    options: [
        {
            name: 'set',
            description: 'Set quote log channel',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The channel you want to set as the quote log',
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
            description: 'Remove quote log channel',
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
            description: 'Displays current quote log channel',
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
            const existingConfig = await Config.findOne({ type: 'quoteLog' });
            if (existingConfig) {
                Config.updateOne({ type: 'quoteLog' }, { $set: { data: channel?.id as string } });
                interaction.editReply(`Quote log channel <#${channel?.id}> has been updated.`);
            } else {
                Config.insertOne({ type: 'quoteLog', data: channel?.id as string });
                interaction.editReply(`Quote log channel <#${channel?.id}> has been set.`);
            }
        } else if (options.getSubcommand() === 'remove') {
            const existingConfig = await Config.findOne({ type: 'quoteLog' });
            if (!existingConfig) {
                interaction.editReply('There currently is no quote log channel set up, please use the quotelog set subcommand to set a quotelog channel.');
            } else {
                Config.deleteOne({ type: 'quoteLog' });
                interaction.editReply(`Quote log channel <#${existingConfig.data}> config has been deleted.`);
            }
        } else if (options.getSubcommand() === 'view') {
            const existingConfig = await Config.findOne({ type: 'quoteLog' });
            if (!existingConfig) {
                interaction.editReply('There currently is no quote log channel set up, please use the quotelog set subcommand to set a quotelog channel.');
            } else {
                interaction.editReply(`The current quote log channel is <#${existingConfig.data}>`);
            }
        }
    },
    async prefixCommand(message, args) {
        const id = args[1] ? args[1].replace('<#', '').replace('>', '') : '';
        const channel = await message.client.channels.fetch(id, { force: true }).catch((err: Error) => {});
        if (args[0] === 'set') {
            const existingConfig = await Config.findOne({ type: 'quoteLog' });
            if (existingConfig) {
                if (!channel) return message.reply(`Channel \`${id}\` does not exist.`);
                Config.updateOne({ type: 'quoteLog' }, { $set: { data: id } });
                message.reply(`Quote log channel ${id} has been updated.`);
            } else {
                if (!channel) return message.reply(`Channel \`${id}\` does not exist.`);
                Config.insertOne({ type: 'quoteLog', data: id });
                message.reply(`Quote log channel ${id} has been set.`);
            }
        } else if (args[0] === 'remove') {
            const existingConfig = await Config.findOne({ type: 'quoteLog' });
            if (!existingConfig) {
                message.reply('There currently is no quote log channel set up, please use the quotelog set subcommand to set a quotelog channel.');
            } else {
                Config.deleteOne({ type: 'quoteLog' });
                message.reply(`Quote log channel ${id} config has been deleted.`);
            }
        } else if (args[0] === 'view') {
            const existingConfig = await Config.findOne({ type: 'quoteLog' });
            if (!existingConfig) {
                message.reply('There currently is no quote log channel set up, please use the quotelog set subcommand to set a quotelog channel.');
            } else {
                message.reply(`The current quote log channel is <#${existingConfig.data}>`);
            }
        } else {
            message.reply(
                'Setting the quote log channel with slash commands type `/quotelog set channel: <channel>`, with prefix commands type `<prefix>quotelog set <channel>`\nRemoving the quote log channel with slash commands type `/quotelog remove channel: <channel>`, with prefix commands type `<prefix>quotelog remove <channel>`\nView the quote log channel with slash commands type `/quotelog view`, with prefix commands type `<prefix>quotelog view`'
            );
        }
    },
});
