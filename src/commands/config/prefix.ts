import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../structures/command.js';
import { Config, type ConfigInterface } from '../../handlers/database/mongo.js';
import { fetchPrefixes } from '../../events/messageCreate.js';

export default new Command({
    name: 'prefix',
    description: 'Add or Remove prefixes',
    options: [
        {
            name: 'add',
            description: 'Add a prefix',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'prefix',
                    description: 'The prefix you want to add',
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
                {
                    type: ApplicationCommandOptionType.Boolean,
                    name: 'hide',
                    description: 'Hide the response',
                },
            ],
        },
        {
            name: 'view',
            description: 'View a list of all prefixes',
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
        const prefix = options.getString('prefix');

        if (options.getSubcommand() === 'add') {
            Config.insertOne({ type: 'prefix', data: prefix as string });
            interaction.editReply(`Prefix \`${prefix}\` has been added.`);
        } else if (options.getSubcommand() === 'remove') {
            Config.deleteOne({ type: 'prefix', data: prefix as string });
            interaction.editReply(`Prefix \`${prefix}\` has been removed.`);
        } else if (options.getSubcommand() === 'view') {
            const prefixes: Array<string> = [];
            for (const prefix of await Config.find({ type: 'prefix' }).toArray()) {
                prefixes.push(prefix.data as string);
            }
            interaction.editReply(`Here is a list of all the prefixes \`\`\`${prefixes.join('``````')}\`\`\``);
        }
        fetchPrefixes();
    },
    async prefixCommand(message, args) {
        if (args[0] === 'add') {
            Config.insertOne({ type: 'prefix', data: args[1] as string });
            message.reply(`Prefix \`${args[1]}\` has been added.`);
        } else if (args[0] === 'remove') {
            Config.deleteOne({ type: 'prefix', data: args[1] as string });
            message.reply(`Prefix \`${args[1]}\` has been removed.`);
        } else if (args[0] === 'view') {
            const prefixes: Array<string> = [];
            for (const prefix of await Config.find({ type: 'prefix' }).toArray()) {
                prefixes.push(prefix.data as string);
            }
            message.reply(`Here is a list of all the prefixes \`\`\`${prefixes.join('``````')}\`\`\``);
        }
        fetchPrefixes();
    },
});
