import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../structures/command.js';
import { Quote, QuoteDeleted, type QuoteInterface } from '../../handlers/database/mongo.js';
import { client } from '../../index.js';

export default new Command({
    name: 'quotedelete',
    description: 'Delete a quote by its ID',
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: 'id',
            description: 'The quotes ID',
            required: true,
        },
        {
            type: ApplicationCommandOptionType.Boolean,
            name: 'hide',
            description: 'Hide the response',
        },
    ],
    aliases: ['qd', 'qdelete', 'qdel'],
    category: 'quotes',
    cooldown: 10,
    async slashCommand(interaction, options) {
        try {
            const id = options.getString('id', true);
            const quote = await Quote.findOne({ id });
            if (!quote) return interaction.editReply(`The quote ${id} jar is empty :3`);
            const createdBy = await interaction.client.users.fetch(quote.createdBy);
            if (!interaction.memberPermissions?.has('Administrator')) if (interaction.user.id !== createdBy.id) return;
            interaction.editReply({
                embeds: [
                    {
                        color: client.embedColor,
                        title: 'Do you wanna compost this quote, myaa?',
                        description: `**ID:** ${quote.id}\n**Keyword:** ${quote.keyword}\n**Text:** ${quote.text}\n**Created By:** ${createdBy.username} (${
                            createdBy.id
                        })\n**Created At:** <t:${Math.floor(quote.createdAt.getTime() / 1_000)}:F>\n`,
                        timestamp: new Date().toISOString(),
                        footer: {
                            text: `Requested by ${interaction.user.username}`,
                            icon_url: interaction.user.displayAvatarURL(),
                        },
                    },
                ],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                customId: `quotedelete_${interaction.user.id}_i_${quote.id}`,
                                label: 'Yes',
                                style: 4,
                            },
                            {
                                type: 2,
                                customId: `cancel_${interaction.user.id}_i`,
                                label: 'No',
                                style: 2,
                            },
                        ],
                    },
                ],
            });
        } catch (err: Error | unknown) {
            console.log(client.timeCode('error'), err);
        }
    },
    async prefixCommand(message, args) {
        if (!args[0]) return message.reply('No ID was provided.');
        const id = args[0];
        if (!id) return;
        const quote = await Quote.findOne({ id });
        if (!quote) return message.reply(`The quote ${id} jar is empty :3`);
        const createdBy = await message.client.users.fetch(quote.createdBy);
        if (!message.member?.permissions.has('Administrator')) if (message.author.id !== createdBy.id) return;
        message.reply({
            embeds: [
                {
                    color: client.embedColor,
                    title: 'Do you wanna compost this quote, myaa?',
                    description: `**ID:** ${quote.id}\n**Keyword:** ${quote.keyword}\n**Text:** ${quote.text}\n**Created By:** ${createdBy.username} (${
                        createdBy.id
                    })\n**Created At:** <t:${Math.floor(quote.createdAt.getTime() / 1_000)}:F>\n`,
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: `Requested by ${message.author.username}`,
                        icon_url: message.author.displayAvatarURL(),
                    },
                },
            ],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            customId: `quotedelete_${message.author.id}_${message.id}_${quote.id}`,
                            label: 'Yes',
                            style: 4,
                        },
                        {
                            type: 2,
                            customId: `cancel_${message.author.id}_${message.id}`,
                            label: 'No',
                            style: 2,
                        },
                    ],
                },
            ],
        });
    },
    async button(interaction, message, args) {
        Quote.findOneAndDelete({ id: args[3] }).then((deleted) => {
            QuoteDeleted(deleted.value as QuoteInterface);
            interaction.deleteReply().catch((err: Error) => {});
            interaction.reply({ content: 'Quote deleted.', ephemeral: true }).catch((err: Error) => {});
            interaction.message.delete().catch((err: Error) => {});
            message?.delete().catch((err: Error) => {});
        });
    },
});
