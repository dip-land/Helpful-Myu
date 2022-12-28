import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../structures/command.js';
import { Config, type ConfigInterface } from '../../handlers/database/mongo.js';

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
                    type: 5,
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
                    type: 5,
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
                    type: 5,
                    name: 'hide',
                    description: 'Hide the response',
                },
            ],
        },
    ],
    aliases: [],
    category: 'config',
    permissions: ['Administrator'],
    async slashCommand(interaction, options) {
        const subOptions = options[0];
        const subSubOptions = subOptions.options as typeof options;

        if (subOptions.name === 'add') {
            Config.insertOne({ type: 'prefix', data: subSubOptions[0].value as string });
            interaction.editReply(`Prefix \`${subSubOptions[0].value}\` has been added.`);
        } else if (subOptions.name === 'remove') {
            await Config.findOneAndDelete({ type: 'prefix', data: subSubOptions[0].value as string });
            interaction.editReply(`Prefix \`${subSubOptions[0].value}\` has been removed.`);
        } else if (subOptions.name === 'view') {
            const prefixData: Array<ConfigInterface> = await Config.find({ type: 'prefix' }).toArray();
            const prefixes: Array<string> = [];
            for (const prefix of prefixData) {
                prefixes.push(prefix.data as string);
            }
            interaction.editReply(`Here is a list of all the prefixes \`\`\`${prefixes.join('``````')}\`\`\``);
        }
    },
});
