import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../structures/command.js';
import { Tenor } from '../../structures/tenor.js';
import { embedColor } from '../../index.js';

export default new Command({
    name: 'baka',
    description: 'With this command you can express that someone behaves lika a baka',
    options: [
        {
            type: ApplicationCommandOptionType.User,
            name: 'target',
            description: 'The user you want to call a baka',
        },
        {
            type: ApplicationCommandOptionType.Boolean,
            name: 'hide',
            description: 'Hide the response',
        },
    ],
    aliases: [],
    category: 'roleplay',
    async slashCommand(interaction, options) {
        const gif = (await new Tenor().search('anime baka', true)).result;
        const target = interaction.options.getUser('target')?.username || interaction.user.username;
        interaction.editReply({
            embeds: [
                {
                    color: embedColor,
                    title: `:anger: ${target} is a baka!!`,
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
        const gif = (await new Tenor().search('anime baka', true)).result;
        const target = args[0] ? (await message.client.users.fetch(args[0].replace('<@', '').replace('>', ''))).username : message.author.username;
        message.reply({
            embeds: [
                {
                    color: embedColor,
                    title: `:anger: ${target} is a baka!!`,
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
