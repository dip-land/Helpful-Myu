import type { Guild, GuildMember } from 'discord.js';
import { Command } from '../../structures/command.js';

export default new Command({
    name: 'avatar',
    description: 'Display another users avatar, or your own',
    options: [
        {
            type: 6,
            name: 'query',
            description: 'User you want to view the avatar of',
        },
        {
            type: 5,
            name: 'server',
            description: 'Show the users server avatar instead of their global avatar',
        },
        {
            type: 4,
            name: 'size',
            description: 'Size of the image',
            choices: [
                {
                    name: '16',
                    value: 16,
                },
                {
                    name: '32',
                    value: 32,
                },
                {
                    name: '64',
                    value: 64,
                },
                {
                    name: '128',
                    value: 128,
                },
                {
                    name: '256',
                    value: 256,
                },
                {
                    name: '512',
                    value: 512,
                },
                {
                    name: '1024',
                    value: 1024,
                },
                {
                    name: '2048',
                    value: 2048,
                },
                {
                    name: '4096',
                    value: 4096,
                },
            ],
        },
        {
            type: 5,
            name: 'hide',
            description: 'Hide the response',
        },
    ],
    aliases: [],
    category: 'utility',
    async slashCommand(interaction) {
        const server = interaction.options.get('server')?.value as boolean | undefined;
        const size = interaction.options.get('size')?.value as 2048 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 4096 | undefined;
        const user = interaction.options.get('query')?.user || interaction.user;
        const member = (interaction.options.get('query')?.member as GuildMember) || (interaction.member as GuildMember);
        const avatar = server ? member.displayAvatarURL({ size: size || 2048 }) : user.displayAvatarURL({ size: size || 2048 });
        const person = server ? member : user;
        if (!avatar) return interaction.editReply('User does not have an avatar.');

        interaction.editReply({
            embeds: [
                {
                    color: 0xafbbea,
                    title: user.tag + ' Avatar',
                    description:
                        `${server ? `**[Server Avatar](${avatar})**` : `**[Global Avatar](${avatar})**`}` +
                        `\n[JPG](${person.displayAvatarURL({ size: 2048, extension: 'jpg', forceStatic: true })})` +
                        ` | [PNG](${person.displayAvatarURL({ size: 2048, extension: 'png', forceStatic: true })})` +
                        ` | [WEBP](${person.displayAvatarURL({ size: 2048, extension: 'webp', forceStatic: true })})` +
                        `${avatar.includes('.gif') ? ` | [GIF](${person.displayAvatarURL({ size: 2048, extension: 'gif' })})` : ''}`,
                    image: {
                        url: avatar,
                    },
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: `Requested by ${interaction.user.tag}`,
                        icon_url: interaction.user.displayAvatarURL(),
                    },
                },
            ],
        });
    },
    async prefixCommand(message, args) {
        let user = args[0] ? await message.client.users.fetch(args[0].replace('<@', '').replace('>', ''), { force: true }).catch((e) => {}) : await message.author.fetch(true);
        if (user === void 0) user = (await message.guild?.members.fetch({ query: args.join(' '), limit: 1 }))?.first()?.user || message.author;
        const member = await (await message.client.guilds.fetch(message?.guildId as string)).members.fetch(user.id);
        const hasServerAvatar = user.displayAvatarURL() !== member.displayAvatarURL();
        const avatar = user.displayAvatarURL({ size: 2048 });
        if (!avatar) return message.reply('User does not have an avatar.');

        const button = {
            type: 1,
            components: [
                {
                    type: 2,
                    customId: `avatar_${message.author.id}_${message.id}_server_${user.id}`,
                    label: 'Server Avatar',
                    style: 1,
                },
            ],
        };

        message.reply({
            embeds: [
                {
                    color: 0xafbbea,
                    title: user.tag + ' Avatar',
                    description:
                        `**[Global Avatar](${avatar})**` +
                        `\n[JPG](${user.displayAvatarURL({ size: 2048, extension: 'jpg', forceStatic: true })})` +
                        ` | [PNG](${user.displayAvatarURL({ size: 2048, extension: 'png', forceStatic: true })})` +
                        ` | [WEBP](${user.displayAvatarURL({ size: 2048, extension: 'webp', forceStatic: true })})` +
                        `${avatar.includes('.gif') ? ` | [GIF](${user.displayAvatarURL({ size: 2048, extension: 'gif' })})` : ''}`,
                    image: {
                        url: avatar,
                    },
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: `Requested by ${message.author.tag}`,
                        icon_url: message.author.displayAvatarURL(),
                    },
                },
            ],
            components: hasServerAvatar ? [button] : [],
        });
    },
    async button(interaction, message, args) {
        const global = args[3] === 'global';
        const user = await interaction.client.users.fetch(args[4]);
        const member = await (await interaction.client.guilds.fetch(message?.guildId as string)).members.fetch(args[4]);
        const avatar = global ? user.displayAvatarURL({ size: 2048 }) : member.displayAvatarURL({ size: 2048 });
        const person = global ? user : member;

        interaction.message.edit({
            embeds: [
                {
                    color: 0xafbbea,
                    title: user.tag + ' Avatar',
                    description:
                        `${global ? `**[Global Avatar](${avatar})**` : `**[Server Avatar](${avatar})**`}` +
                        `\n[JPG](${person.displayAvatarURL({ size: 2048, extension: 'jpg', forceStatic: true })})` +
                        ` | [PNG](${person.displayAvatarURL({ size: 2048, extension: 'png', forceStatic: true })})` +
                        ` | [WEBP](${person.displayAvatarURL({ size: 2048, extension: 'webp', forceStatic: true })})` +
                        `${avatar.includes('.gif') ? ` | [GIF](${person.displayAvatarURL({ size: 2048, extension: 'gif' })})` : ''}`,
                    image: {
                        url: avatar,
                    },
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
                            customId: `avatar_${message?.author.id}_${message?.id}_${global ? 'server' : 'global'}_${user.id}`,
                            label: `${global ? 'Server' : 'Global'} Avatar`,
                            style: 1,
                        },
                    ],
                },
            ],
        });
        interaction.deferUpdate();
    },
});
