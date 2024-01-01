import { ApplicationCommandOptionType, TextInputBuilder, ButtonBuilder, ActionRowBuilder, EmbedBuilder, type MessageCollector } from 'discord.js';
import { Command } from '../../structures/command.js';
import { Modal } from '../../structures/modal.js';
import { Config } from '../../handlers/database/mongo.js';
import { client } from '../../index.js';

export default new Command({
    name: 'testmessagefilter',
    description: 'placeholder command',
    options: [
        {
            type: ApplicationCommandOptionType.Channel,
            name: 'channel',
            description: 'Sets the target channel',
            required: true,
        },
        {
            type: ApplicationCommandOptionType.Boolean,
            name: 'hide',
            description: 'Hide the response',
        },
    ],
    defered: false,
    aliases: ['test'],
    beta: true,
    category: 'config',
    async slashCommand(interaction, options) {
        const channel = options.getChannel('channel', true);
        const config = await Config.findOne({ 'data.channel': channel.id });
        if (config && typeof config.data === 'object') {
            const emojis = new ButtonBuilder().setCustomId(`test_${interaction.user.id}_i_emojis_${channel.id}`).setLabel('Edit Emojis').setStyle(1);
            const allowedUrls = new ButtonBuilder().setCustomId(`test_${interaction.user.id}_i_urls_${channel.id}`).setLabel('Edit Allowed URLS').setStyle(1);
            const maxMessages = new ButtonBuilder().setCustomId(`test_${interaction.user.id}_i_maxmsgs_${channel.id}`).setLabel('Edit Max Messages').setStyle(1);
            const messages = new ButtonBuilder().setCustomId(`test_${interaction.user.id}_i_msgs_${channel.id}`).setLabel('Edit Messages').setStyle(1);
            const deleteAtMax = new ButtonBuilder().setCustomId(`test_${interaction.user.id}_i_deletemax_${channel.id}`).setLabel('Edit Delete At Max').setStyle(1);
            const bypassUsers = new ButtonBuilder().setCustomId(`test_${interaction.user.id}_i_bypass_${channel.id}`).setLabel('Edit Bypass Users').setStyle(1);
            const deleteConfig = new ButtonBuilder().setCustomId(`test_${interaction.user.id}_i_delete_${channel.id}`).setLabel('Delete Config').setStyle(4);
            const configEmbed = new EmbedBuilder()
                .addFields(
                    { name: 'Channel', value: `<#${channel.id}> (${channel.id})`, inline: true },
                    { name: 'Emojis', value: config.data.emojis.join(', '), inline: true },
                    { name: 'Allowed URLs', value: config.data.allowedUrls.join(', '), inline: true },
                    { name: 'Max Messages', value: config.data.maxMessages.toString(), inline: true },
                    { name: 'Messages', value: config.data.messages.join(', '), inline: true },
                    { name: 'Delete at Max', value: `${config.data.deleteAtMax}`, inline: true },
                    { name: 'Bypass Users', value: config.data.bypassUsers ? config.data.bypassUsers.join(', ') : 'none', inline: true }
                )
                .setColor((this as any)._client.embedColor);
            const buttons = [
                new ActionRowBuilder().addComponents(emojis, allowedUrls, maxMessages, messages),
                new ActionRowBuilder().addComponents(deleteAtMax, bypassUsers, deleteConfig),
            ] as any;
            interaction.followUp({ embeds: [configEmbed], components: buttons }).catch((err) => {});
        } else {
            const yes = new ButtonBuilder().setCustomId(`test_${interaction.user.id}_i_create_${channel.id}`).setLabel('Yes').setStyle(1);
            const no = new ButtonBuilder().setCustomId(`cancel_${interaction.user.id}_i`).setLabel('No').setStyle(4);
            const buttons = [new ActionRowBuilder().addComponents(yes, no)] as any;
            interaction.followUp({ content: `<#${channel.id}> has no config.\nWould you like to create one?`, components: buttons }).catch((err) => {});
        }
    },
    //button
    async button(interaction, message, args) {
        const configChannelID = args[4];
        const button = args[3];

        const modal = {
            urls: new TextInputBuilder().setCustomId(`allowedurls_${configChannelID}`).setLabel('Allowed URLs'),
            maxmsgs: new TextInputBuilder().setCustomId(`maxmessages_${configChannelID}`).setLabel('Max Messages'),
            msgs: new TextInputBuilder().setCustomId(`messages_${configChannelID}`).setLabel('Messages'),
            deletemax: new TextInputBuilder().setCustomId(`deleteatmax_${configChannelID}`).setLabel('Delete At Max'),
            bypass: new TextInputBuilder().setCustomId(`bypassusers_${configChannelID}`).setLabel('Bypass Users'),
        }[args[3]] as TextInputBuilder;
        if (modal) return interaction.showModal(new Modal({ title: `${modal.data.label}`, custom_id: 'test' }, modal));

        if (button === 'delete') {
            const yes = new ButtonBuilder().setCustomId(`test_${interaction.user.id}_i_confirmDelete_${configChannelID}_${interaction.message.id}`).setLabel('Yes').setStyle(4);
            const no = new ButtonBuilder().setCustomId(`cancel_${interaction.user.id}_i`).setLabel('No').setStyle(1);
            const buttons = [new ActionRowBuilder().addComponents(yes, no)] as any;
            interaction.reply({ content: 'Are you sure you want to delete this config?', components: buttons });
        }

        if (button === 'confirmDelete') {
            interaction.message.delete().catch((err) => {});
            (await interaction.channel?.messages.fetch(args[5]))?.delete().catch((err) => {});
            //insert config delete code
            interaction.reply('Config deleted.').then((m) => setTimeout(() => m.delete(), 5_000));
        }

        if (button === 'emojis') {
            const interactionReply = await interaction.reply(
                'Please send the emojis you want to be reacted on posts in one message, please seperate each emoji with a space (if you use the emoji picker it automatically inserts a space).'
            );
            const collector = interaction.channel?.createMessageCollector({ filter: (m) => m.author.id === interaction.user.id, max: 1, time: 60 * 10000 }) as MessageCollector;
            collector.on('collect', (message) => {
                const emojis = message.content
                    .split(' ')
                    .map((v) => v.match(/<:\w+:\d+>/g))
                    .join(' ')
                    .split(' ');
                if (!emojis || !emojis[0]) {
                    collector.stop();
                    interaction.followUp('You sent no emojis, press the edit emojis button to try again... or dont.').then((m) => setTimeout(() => m.delete(), 10_000));
                    return;
                }

                Config.updateOne({ 'data.channel': configChannelID }, { $set: { 'data.emojis': [...new Set(emojis)] } }).then(() => {
                    interaction.followUp('Emojis submitted and config has been updated.').then((m) => setTimeout(() => m.delete(), 10_000));
                    interactionReply.delete().catch((err) => {});
                    message.delete().catch((err) => {});
                    collector.stop();
                });
            });
        }
    },
    //modal
    async modal(interaction, fields) {
        //none of this is implemented yet :)
        console.log(fields.first());
        interaction.reply('Config Updated.').then((m) => setTimeout(() => m.delete(), 5_000));
    },
});
