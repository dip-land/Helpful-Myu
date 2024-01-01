import { ApplicationCommandOptionType, ChannelType } from 'discord.js';
import { Command } from '../../structures/command.js';
import { Reaction } from '../../handlers/database/mongo.js';

export default new Command({
    name: 'reactionrole',
    description: 'Add or Remove a reaction roles',
    options: [
        {
            name: 'add',
            description: 'Add reaction roles to a message',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'messagelink',
                    description: 'The link to the message you want to have reaction roles',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'roles',
                    description: 'The roles you want users to recive, put these in order of the roles you wanted',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'emojis',
                    description: 'The emojis you want users to react to, put these in order of the roles you wanted',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'number_of_roles',
                    description: 'How many roles a user can have from a group',
                    type: ApplicationCommandOptionType.Number,
                    required: true,
                },
                {
                    name: 'grouped_messages',
                    description: 'Message links for the messages you want to group with this one',
                    type: ApplicationCommandOptionType.String,
                },
                {
                    name: 'required_role',
                    description: "The role that's required for a user to have to react and get a role",
                    type: ApplicationCommandOptionType.String,
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
            description: 'Remove reaction roles from a message',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'messagelink',
                    description: 'The link to the message that you want to remove reaction roles from',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
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
        const messagelink = options.getString('messagelink', true);

        const ids = messagelink.split('/channels/')[1].split('/');
        const [, channelId, messageId] = ids;

        const message = await interaction.guild?.channels.fetch(channelId).then(async (channel) => {
            return channel?.isTextBased() && channel.type === ChannelType.GuildText ? await channel.messages.fetch(messageId) : null;
        });

        if (options.getSubcommand() === 'add') {
            try {
                const roles = options.getString('roles', true).replaceAll('<@&', '').replaceAll('>', '').split(' ');
                const emojis = options.getString('emojis', true).replaceAll('<:', '').replaceAll('>', '').split(' ');
                for (const emoji of emojis) {
                    message?.react(emoji);
                }
                const numberOfRoles = options.getNumber('number_of_roles', true);
                const groupedMessages = options.getString('grouped_messages', true).split(' ');
                const requiredRole = `${options.getString('required_role')}`.replaceAll('<@&', '').replaceAll('>', '');
                Reaction.insertOne({ message: message?.id as string, roles, emojis, requiredRole, numberOfRoles, groupedMessages });
                interaction.editReply('Reaction Role group created.');
            } catch (err) {
                interaction.editReply('Something went wrong...');
            }
        } else if (options.getSubcommand() === 'remove') {
            try {
                Reaction.deleteOne({ message: message?.id as string });
                interaction.editReply('Reaction Role group deleted.');
            } catch (err) {
                interaction.editReply('Something went wrong...');
            }
        }
    },
});
