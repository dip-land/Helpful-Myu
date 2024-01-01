import { ApplicationCommandOptionType, type ChatInputCommandInteraction, type Attachment, type Message } from 'discord.js';
import { Command } from '../../classes/Command.js';
import { Config, type IConfig, type TConfigChannel, type TConfigImage, type TConfigMessage } from '../../handlers/database/mongoose.js';
import { client } from '../../index.js';

export default new Command({
    name: 'configure',
    description: 'Configure your logs / prefixes',
    category: 'utility',
    default_member_permissions: '8',
    permissions: ['Administrator'],
    aliases: ['config'],
    deferReply: true,
    options: [
        {
            name: 'join_log',
            description: 'Set or Remove the join log channel',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'set',
                    description: 'Set the join log channel',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'channel',
                            description: 'The channel you want to set as the join log',
                            type: ApplicationCommandOptionType.Channel,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'remove',
                    description: 'Remove the join log channel',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [],
                },
            ],
        },
        {
            name: 'leave_log',
            description: 'Set or Remove the leave log channel',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'set',
                    description: 'Set the leave log channel',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'channel',
                            description: 'The channel you want to set as the leave log',
                            type: ApplicationCommandOptionType.Channel,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'remove',
                    description: 'Remove the leave log channel',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [],
                },
            ],
        },
        {
            name: 'quote_log',
            description: 'Set or Remove the quote log channel',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'set',
                    description: 'Set the quote log channel',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'channel',
                            description: 'The channel you want to set as the quote log',
                            type: ApplicationCommandOptionType.Channel,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'remove',
                    description: 'Remove the quote log channel',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [],
                },
            ],
        },
        {
            name: 'boost_image',
            description: 'Set or Remove the boost image',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'set',
                    description: 'Set the boost image',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'image',
                            description: 'The image you want to set as the boost image',
                            type: ApplicationCommandOptionType.Attachment,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'remove',
                    description: 'Remove the boost image',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [],
                },
            ],
        },
        {
            name: 'boost_channel',
            description: 'Set or Remove the boost channel',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'set',
                    description: 'Set the boost channel',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'channel',
                            description: 'The channel you want to set as the boost channel',
                            type: ApplicationCommandOptionType.Channel,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'remove',
                    description: 'Remove the boost channel',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [],
                },
            ],
        },
        {
            name: 'boost_message',
            description: 'Set or Remove the boost message',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'set',
                    description: 'Set the boost message',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'message',
                            description: 'The message you want to set as the boost message',
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'remove',
                    description: 'Remove the boost message',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [],
                },
            ],
        },
        {
            name: 'join_image',
            description: 'Set or Remove the join image',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'set',
                    description: 'Set the join image',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'image',
                            description: 'The image you want to set as the join image',
                            type: ApplicationCommandOptionType.Attachment,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'remove',
                    description: 'Remove the join image',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [],
                },
            ],
        },
        {
            name: 'join_channel',
            description: 'Set or Remove the join channel',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'set',
                    description: 'Set the join channel',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'channel',
                            description: 'The channel you want to set as the join channel',
                            type: ApplicationCommandOptionType.Channel,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'remove',
                    description: 'Remove the join channel',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [],
                },
            ],
        },
        {
            name: 'join_message',
            description: 'Set or Remove the join message',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'set',
                    description: 'Set the join message',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'message',
                            description: 'The message you want to set as the join message',
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'remove',
                    description: 'Remove the join message',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [],
                },
            ],
        },
        {
            name: 'prefix',
            description: 'Add, Remove or View the prefixes',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'add',
                    description: 'Add a prefix.',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'prefix',
                            description: 'The prefix you want to add',
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'remove',
                    description: 'Remove a prefix',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'prefix',
                            description: 'The prefix you want to remove',
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        },
                    ],
                },
            ],
        },
        {
            name: 'view',
            description: 'View current bot config',
            type: ApplicationCommandOptionType.Subcommand,
            options: [],
        },
    ],
    async slashCommand({ interaction, options, client }) {
        let config: any = await Config.findOne({ guild: interaction.guildId });
        if (!config) config = await Config.create({ guild: interaction.guildId });
        config = config.toJSON() as IConfig;
        const subCommand = options.getSubcommand();
        const subGroup = options.getSubcommandGroup()?.toString().split('_') as Array<string>;
        if (subCommand === 'view') {
            return interaction.editReply({
                embeds: [
                    {
                        title: 'Current Bot Configuration',
                        fields: [
                            { name: 'Quote Log', value: config.quoteLog ? `<#${config.quoteLog}>` : 'No quote log has been set.' },
                            { name: 'Join Log', value: config.joinLog ? `<#${config.joinLog}>` : 'No join log has been set.' },
                            { name: 'Leave Log', value: config.leaveLog ? `<#${config.leaveLog}>` : 'No leave log has been set.' },
                            { name: 'Level Log', value: config.levelLog ? `<#${config.levelLog}>` : 'No level log has been set. (This setting currently does nothing)' },
                            { name: 'Boost Image', value: config.boostImage ? `${config.boostImage}` : 'No boost image has been set.' },
                            { name: 'Boost Image Channel', value: config.boostChannel ? `<#${config.boostChannel}>` : 'No boost image channel has been set.' },
                            { name: 'Boost Message', value: config.boostMessage ? `${config.boostMessage}` : 'No boost message has been set.' },
                            { name: 'Join Image', value: config.joinImage ? `${config.joinImage}` : 'No join image has been set.' },
                            { name: 'Join Image Channel', value: config.joinChannel ? `<#${config.joinChannel}>` : 'No join image channel has been set.' },
                            { name: 'Join Message', value: config.joinMessage ? `${config.joinMessage}` : 'No join message has been set.' },
                            { name: 'Prefixes', value: config.prefixes.join('/n') },
                        ],
                        color: client.embedColor,
                    },
                ],
            });
        }
        const parsedGroup = subGroup[1] ? subGroup[0] + subGroup[1].charAt(0).toUpperCase() + subGroup[1].slice(1) : subGroup[0];
        const prefix = options.getString('prefix');
        if (subCommand === 'set' || subCommand === 'add') {
            const channel = options.getChannel('channel');
            const message = options.getString('message');
            const attachment = options.getAttachment('image');
            const attachmentChannel = await client.channels.fetch('1124053160739209216');
            if (channel || message) {
                config[parsedGroup as TConfigChannel | TConfigMessage] = message ? message : (channel?.id as string);
                interaction.editReply(`Setting \`${parsedGroup}\` to ${message ? `\`${message}\`` : `<#${channel?.id}>`}... (this may take awhile)`);
                setConfig(config, interaction, {
                    data: `\`${parsedGroup}\` set to ${message ? `\`${message}\`` : `<#${channel?.id}>`}.`,
                    error: `There was an error setting \`${parsedGroup}\` to ${message ? `\`${message}\`` : `<#${channel?.id}>`}, please try again later.`,
                });
            } else if (attachment && attachmentChannel?.isTextBased()) {
                attachmentChannel
                    .send({ files: [{ name: interaction.guildId + '.' + attachment.contentType?.replace('image/', ''), attachment: attachment.url }] })
                    .then((message: Message) => {
                        config[parsedGroup as TConfigImage] = (message.attachments.at(0) as Attachment).url;
                        interaction.editReply(`Setting \`${parsedGroup}\` to \`${config[parsedGroup as TConfigImage]}\`... (this may take awhile)`);
                        setConfig(config, interaction, {
                            data: `\`${parsedGroup}\` set to \`${config[parsedGroup as TConfigImage]}\`.`,
                            error: `There was an error setting \`${parsedGroup}\` to \`${config[parsedGroup as TConfigImage]}\`, please try again later.`,
                        });
                    });
            } else if (prefix) {
                config[parsedGroup as 'prefixes'].push(prefix);
                interaction.editReply(`Adding \`${prefix}\` to \`${parsedGroup}\`... (this may take awhile)`);
                setConfig(config, interaction, {
                    data: `\`${prefix}\` added to \`${parsedGroup}\`.`,
                    error: `There was an error adding \`${prefix}\` to \`${parsedGroup}\`, please try again later.`,
                });
            }
        }
        if (subCommand === 'remove') {
            if (prefix) {
                delete config[parsedGroup as 'prefixes'][config[parsedGroup as 'prefixes'].indexOf(prefix)];
                interaction.editReply(`Removing \`${prefix}\` from \`${parsedGroup}\`... (this may take awhile)`);
                setConfig(config, interaction, {
                    data: `\`${prefix}\` removed from \`${parsedGroup}\`.`,
                    error: `There was an error removing \`${prefix}\` from \`${parsedGroup}\`, please try again later.`,
                });
            } else {
                config[parsedGroup as TConfigChannel | TConfigMessage | TConfigImage] = '';
                interaction.editReply(`Removing \`${parsedGroup}\`... (this may take awhile)`);
                setConfig(config, interaction, {
                    data: `Removed \`${parsedGroup}\`.`,
                    error: `There was an error removing \`${parsedGroup}\`, please try again later.`,
                });
            }
        }
    },
});

function setConfig(config: IConfig, msg: ChatInputCommandInteraction | Message, options: { data: string; error: string }): void {
    Config.findOneAndUpdate({ guild: msg.guildId }, { $set: config })
        .then(() => {
            if ('editReply' in msg) msg.editReply(options.data);
            else msg.reply(options.data);
        })
        .catch((err) => {
            client.error(err);
            if ('editReply' in msg) msg.editReply(options.error);
            else msg.reply(options.error);
        });
}
