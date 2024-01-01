import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../structures/command.js';
import { Tenor } from '../../structures/tenor.js';
import { client } from '../../index.js';

export default new Command({
    name: 'lapsit',
    description: 'With this command you can sit on the lap of another user',
    options: [
        {
            type: ApplicationCommandOptionType.Boolean,
            name: 'hide',
            description: 'Hide the response',
        },
    ],
    aliases: [],
    category: 'roleplay',
    beta: true,
    async slashCommand(interaction, options) {
        const gif = (await new Tenor().search('anime lapsit', true)).result;
        interaction.editReply({
            embeds: [
                {
                    color: client.embedColor,
                    title: `:anger: ${interaction.user.username} is lapsit!!`,
                    image: {
                        url: gif.media_formats.gif.url,
                    },
                    footer: {
                        text: `Requested by ${interaction.user.username}  |  Gif from Tenor`,
                        icon_url: interaction.user.displayAvatarURL(),
                    },
                },
            ],
        });
    },
    async prefixCommand(message, args) {
        const gif = (await new Tenor().search('anime lapsit', true)).result;
        message.reply({
            embeds: [
                {
                    color: client.embedColor,
                    title: `:anger: ${message.author.username} is lapsit!!`,
                    image: {
                        url: gif.media_formats.gif.url,
                    },
                    footer: {
                        text: `Requested by ${message.author.username}  |  Gif from Tenor`,
                        icon_url: message.author.displayAvatarURL(),
                    },
                },
            ],
        });
    },
});
