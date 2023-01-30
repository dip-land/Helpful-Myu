import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../structures/command.js';
import { Tenor } from '../../structures/tenor.js';
import { embedColor } from '../../index.js';

export default new Command({
    name: 'angry',
    description: 'You can express that you are angry',
    options: [
        {
            type: ApplicationCommandOptionType.Boolean,
            name: 'hide',
            description: 'Hide the response',
        },
    ],
    aliases: [],
    category: 'roleplay',
    async slashCommand(interaction, options) {
        const gif = (await new Tenor().search('anime angry', true)).result;
        interaction.editReply({
            embeds: [
                {
                    color: embedColor,
                    title: `:anger: ${interaction.user.username} is angry!!`,
                    image: {
                        url: gif.media_formats.gif.url,
                    },
                    footer: {
                        text: `Requested by ${interaction.user.tag}  |  Gif from Tenor`,
                        icon_url: interaction.user.displayAvatarURL(),
                    },
                },
            ],
        });
    },
    async prefixCommand(message, args) {
        const gif = (await new Tenor().search('anime angry', true)).result;
        message.reply({
            embeds: [
                {
                    color: embedColor,
                    title: `:anger: ${message.author.username} is angry!!`,
                    image: {
                        url: gif.media_formats.gif.url,
                    },
                    footer: {
                        text: `Requested by ${message.author.tag}  |  Gif from Tenor`,
                        icon_url: message.author.displayAvatarURL(),
                    },
                },
            ],
        });
    },
});
