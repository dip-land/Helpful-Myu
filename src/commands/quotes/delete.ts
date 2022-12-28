import { Command } from '../../structures/command.js';
import { Quote, QuoteDeleted, type QuoteInterface } from '../../handlers/database/mongo.js';

export default new Command({
    name: 'quotedelete',
    description: 'Delete a quote by its ID',
    options: [
        {
            type: 3,
            name: 'id',
            description: 'The quotes ID',
            required: true,
        },
        {
            type: 5,
            name: 'hide',
            description: 'Hide the response',
        },
    ],
    aliases: ['qd', 'qdelete', 'qdel'],
    category: 'quotes',
    cooldown: 10,
    async slashCommand(interaction, options) {
        try {
            const id = options.find((option) => option.name === 'id')?.value as string;
            const quote = await Quote.findOne({ id });
            if (!quote) return interaction.editReply(`The quote ${id} jar is empty :3`);
            const createdBy = await interaction.client.users.fetch(quote.createdBy);
            if (!interaction.memberPermissions?.has('Administrator')) if (interaction.user.id !== createdBy.id) return;
            interaction.editReply({
                embeds: [
                    {
                        color: 0xfab6ec,
                        title: 'Do you wanna compost this quote, myaa?',
                        description: `**ID:** ${quote.id}\n**Keyword:** ${quote.keyword}\n**Text:** ${quote.text}\n**Created By:** ${createdBy.tag} (${
                            createdBy.id
                        })\n**Created At:** <t:${Math.floor(quote.createdAt.getTime() / 1000)}:F>\n`,
                        timestamp: new Date().toISOString(),
                        footer: {
                            text: `Requested by ${interaction.user.tag}`,
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
        } catch (error) {
            console.log(error);
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
                    color: 0xfab6ec,
                    title: 'Do you wanna compost this quote, myaa?',
                    description: `**ID:** ${quote.id}\n**Keyword:** ${quote.keyword}\n**Text:** ${quote.text}\n**Created By:** ${createdBy.tag} (${
                        createdBy.id
                    })\n**Created At:** <t:${Math.floor(quote.createdAt.getTime() / 1000)}:F>\n`,
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: `Requested by ${message.author.tag}`,
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
            interaction.deleteReply().catch((e) => {});
            interaction.reply({ content: 'Quote deleted.', ephemeral: true }).catch((e) => {});
            interaction.message.delete().catch((e) => {});
            message?.delete().catch((e) => {});
        });
    },
});
