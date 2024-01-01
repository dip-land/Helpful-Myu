import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../structures/command.js';
import { Tenor } from '../../structures/tenor.js';
import { client } from '../../index.js';

export default new Command({
    name: 'bonk',
    description: 'With this command you can bonk another user',
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
        const gif = (await new Tenor().search('anime bonk', true)).result;
        const target = interaction.options.getUser('target')?.username || interaction.user.username;
        const title = target === interaction.user.username ? `${target} is biting someone!` : `${target}, you're getting bitten by ${interaction.user.username}!`;
        interaction.editReply({
            embeds: [
                {
                    color: client.embedColor,
                    title: `:drop_of_blood: ${title}`,
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
        const gif = (await new Tenor().search('anime bonk', true)).result;
        const target = args[0] ? (await message.client.users.fetch(args[0].replace('<@', '').replace('>', ''))).username : message.author.username;
        const title = target === message.author.username ? `${target} is biting someone!` : `${target}, you're getting bitten by ${message.author.username}!`;
        message.reply({
            embeds: [
                {
                    color: client.embedColor,
                    title: `:drop_of_blood: ${title}`,
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
