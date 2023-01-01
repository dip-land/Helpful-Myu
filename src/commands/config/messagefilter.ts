import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../structures/command.js';
import { Config } from '../../handlers/database/mongo.js';

export default new Command({
    name: 'messagefilter',
    description: 'Add, Remove, Update or View channel filter configs',
    options: [
        {
            name: 'add',
            description: 'Add a channel filter config',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The channel you want to add',
                    type: ApplicationCommandOptionType.Channel,
                    required: true,
                },
                {
                    name: 'emojis',
                    description: 'Emojis to react to attachments/allowedurls',
                    type: ApplicationCommandOptionType.String,
                },
                {
                    name: 'allowedurls',
                    description: 'The Urls that get reacted to if there are emojis',
                    type: ApplicationCommandOptionType.String,
                },
                {
                    name: 'attachmentonlymode',
                    description: 'Make the channel only allow (image/video) attachments/allowedurls',
                    type: ApplicationCommandOptionType.Boolean,
                },
                {
                    name: 'maxmessages',
                    description: 'Maximum number of non-attachment messages',
                    type: ApplicationCommandOptionType.Number,
                },
                {
                    name: 'messages',
                    description: 'Messages to send when max messages is reached, messages must be in JSON Array format',
                    type: ApplicationCommandOptionType.String,
                },
                {
                    name: 'delete_at_max',
                    description: 'Delete messages when max messages is reached',
                    type: ApplicationCommandOptionType.Boolean,
                },
                {
                    name: 'bypassusers_image',
                    description: 'User that can bypass attachment only mode',
                    type: ApplicationCommandOptionType.String,
                },
                {
                    name: 'bypassusers_maxmessages',
                    description: 'User that can bypass the maximum number of non-attachment messages',
                    type: ApplicationCommandOptionType.String,
                },
                {
                    type: 5,
                    name: 'hide',
                    description: 'Hide the response',
                },
            ],
        },
        {
            name: 'update',
            description: 'Update a channel config',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The channel you want to add',
                    type: ApplicationCommandOptionType.Channel,
                    required: true,
                },
                {
                    name: 'emojis',
                    description: 'Emojis to react to attachments/allowedurls',
                    type: ApplicationCommandOptionType.String,
                },
                {
                    name: 'allowedurls',
                    description: 'The Urls that get reacted to if there are emojis',
                    type: ApplicationCommandOptionType.String,
                },
                {
                    name: 'attachmentonlymode',
                    description: 'Make the channel only allow (image/video) attachments/allowedurls',
                    type: ApplicationCommandOptionType.Boolean,
                },
                {
                    name: 'maxmessages',
                    description: 'Maximum number of non-attachment messages',
                    type: ApplicationCommandOptionType.Number,
                },
                {
                    name: 'messages',
                    description: 'Messages to send when max messages is reached, messages must be in JSON Array format',
                    type: ApplicationCommandOptionType.String,
                },
                {
                    name: 'delete_at_max',
                    description: 'Delete messages when max messages is reached',
                    type: ApplicationCommandOptionType.Boolean,
                },
                {
                    type: 5,
                    name: 'hide',
                    description: 'Hide the response',
                },
            ],
        },
        {
            name: 'remove',
            description: 'Remove a channel filter',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The channel you want to remove',
                    type: ApplicationCommandOptionType.Channel,
                    required: true,
                },
                {
                    type: 5,
                    name: 'hide',
                    description: 'Hide the response',
                },
            ],
        },
        {
            name: 'view',
            description: 'View a list of all channels that have filters',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The channel you want to view the config of',
                    type: ApplicationCommandOptionType.Channel,
                },
                {
                    type: 5,
                    name: 'hide',
                    description: 'Hide the response',
                },
            ],
        },
    ],
    aliases: ['mf'],
    category: 'config',
    permissions: ['Administrator'],
    disabled: true,
    async slashCommand(interaction, options) {
        interaction.editReply('Disabled.');
    },
});
