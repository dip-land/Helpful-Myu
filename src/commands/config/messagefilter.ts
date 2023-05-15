import { ApplicationCommandOptionType, type Channel } from 'discord.js';
import { Command } from '../../structures/command.js';
import { type MessageFilterConfigInterface, Config } from '../../handlers/database/mongo.js';
import { fetchChannelConfigs } from '../../handlers/messageFilter.js';
import { timeCode } from '../../index.js';

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
                    type: ApplicationCommandOptionType.Boolean,
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
                    type: ApplicationCommandOptionType.Boolean,
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
                    type: ApplicationCommandOptionType.Boolean,
                    name: 'hide',
                    description: 'Hide the response',
                },
            ],
        },
        {
            name: 'view',
            description: 'View a list of all channels that have filters or a specific channel',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The channel you want to view the config of',
                    type: ApplicationCommandOptionType.Channel,
                },
                {
                    type: ApplicationCommandOptionType.Boolean,
                    name: 'hide',
                    description: 'Hide the response',
                },
            ],
        },
    ],
    aliases: ['mf'],
    category: 'config',
    default_member_permissions: '8',
    permissions: ['Administrator'],
    async slashCommand(interaction, options) {
        const channel = options.get('channel')?.channel as Channel;
        const emojis = options.getString('emojis') as string;
        const allowedUrls = options.getString('allowedurls') as string;
        const maxMessages = options.getNumber('maxmessages') as number;
        const messages = options.getString('messages') as string;
        const deleteAtMax = options.getBoolean('delete_at_max') as boolean;
        const existingConfig = channel?.id ? await Config.findOne({ 'data.channel': channel.id }) : null;

        if (options.getSubcommand() === 'add') {
            if (existingConfig) return interaction.editReply('There is already an existing config for the specified channel, use the update subcommand to update a config.');
            const parsedEmojis = emojis ? emojis.split(/\s/g) : [];
            const parsedUrls = allowedUrls ? allowedUrls.split(/\s/g) : [];
            const parsedMessages = messages ? JSON.parse(messages) : [];
            Config.insertOne({
                type: 'channel',
                data: { channel: channel.id, emojis: parsedEmojis, allowedUrls: parsedUrls, maxMessages, messages: parsedMessages, deleteAtMax },
            })
                .then(() => {
                    interaction.editReply('Channel message filter config created.');
                    fetchChannelConfigs();
                })
                .catch((err: Error) => {
                    console.log(timeCode('error'), err);
                    interaction.editReply('There was an error creating the config, please let shhh#7612 know about this.');
                });
        } else if (options.getSubcommand() === 'update') {
            if (!existingConfig) return interaction.editReply('There is no config for the specified channel, use the add subcommand to create a config.');
            const parsedEmojis = emojis ? emojis.split(/\s/g) : (existingConfig.data as MessageFilterConfigInterface).emojis;
            const parsedUrls = allowedUrls ? allowedUrls.split(/\s/g) : (existingConfig.data as MessageFilterConfigInterface).allowedUrls;
            const parsedMessages = messages ? JSON.parse(messages) : (existingConfig.data as MessageFilterConfigInterface).messages;
            const maxMessages_ = maxMessages ? maxMessages : (existingConfig.data as MessageFilterConfigInterface).maxMessages;
            const deleteAtMax_ = deleteAtMax ? deleteAtMax : (existingConfig.data as MessageFilterConfigInterface).deleteAtMax;
            Config.updateOne(
                { 'data.channel': channel.id },
                {
                    $set: {
                        data: {
                            channel: channel.id,
                            emojis: parsedEmojis,
                            allowedUrls: parsedUrls,
                            maxMessages: maxMessages_,
                            messages: parsedMessages,
                            deleteAtMax: deleteAtMax_,
                        },
                    },
                }
            )
                .then(() => {
                    interaction.editReply('Channel message filter config updated.');
                    fetchChannelConfigs();
                })
                .catch((err: Error) => {
                    console.log(timeCode('error'), err);
                    interaction.editReply('There was an error updating the config, please let shhh#7612 know about this.');
                });
        } else if (options.getSubcommand() === 'remove') {
            if (!existingConfig) return interaction.editReply('There is no config for the specified channel, use the view subcommand to view every channel that has a config.');
            Config.deleteOne({ 'data.channel': channel.id })
                .then(() => {
                    interaction.editReply('Channel message filter config deleted.');
                })
                .catch((err: Error) => {
                    console.log(timeCode('error'), err);
                    interaction.editReply('There was an error deleting the config, please let shhh#7612 know about this.');
                });
        } else if (options.getSubcommand() === 'view') {
            if (existingConfig) {
                return interaction.editReply(`Config for <#${channel.id}>\`\`\`` + JSON.stringify(existingConfig.data, null, 2) + '```');
            }
            const channels: Array<string> = [];
            for (const config of await Config.find({ type: 'channel' }).toArray()) {
                channels.push((config.data as MessageFilterConfigInterface).channel);
            }
            interaction.editReply(`Here is a list of every channel with a config <#${channels.join('>, <#')}>`);
        }
    },
    async prefixCommand(message, args) {
        try {
            Config.insertOne({
                type: 'channel',
                data: JSON.parse(args.join('')),
            })
                .then(() => {
                    message.reply('Channel message filter config created.');
                    fetchChannelConfigs();
                })
                .catch((err: Error) => {
                    console.log(timeCode('error'), err);
                    message.reply('There was an error creating the config, please let shhh#7612 know about this.');
                });
        } catch (err) {
            message.reply('Something went wrong...');
            console.log(timeCode('error'), err);
        }
    },
});
