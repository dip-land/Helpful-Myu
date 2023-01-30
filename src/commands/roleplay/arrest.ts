import { ApplicationCommandOptionType } from 'discord.js';
import { Command } from '../../structures/command.js';
import { Tenor } from '../../structures/tenor.js';
import { embedColor } from '../../index.js';

export default new Command({
    name: 'arrest',
    description: 'With this command you can arrest another user',
    options: [
        {
            type: ApplicationCommandOptionType.User,
            name: 'target',
            description: 'The user you want to arrest',
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
        const gif = (await new Tenor().search('anime arrest', true)).result;
        const target = interaction.options.getUser('target')?.username;
        const title = target ? `${target}, you're under arrest!` : "You're under arrest!";
        interaction.editReply({
            embeds: [
                {
                    color: embedColor,
                    title: `:police_officer: ${title}`,
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
        const gif = (await new Tenor().search('anime arrest', true)).result;
        const title = args[0] ? `${(await message.client.users.fetch(args[0].replace('<@', '').replace('>', ''))).username}, you're under arrest!` : "You're under arrest!";
        message.reply({
            embeds: [
                {
                    color: embedColor,
                    title: `:police_officer: ${title}`,
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
