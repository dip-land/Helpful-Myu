import type { GuildMember } from 'discord.js';
import { client } from '../index.js';
import { Event } from '../classes/Event.js';

export default new Event({
    name: 'guildMemberAdd',
    async fn(member: GuildMember, exclude?: { joinLog: boolean; joinChannel: boolean }) {
        const sendChannel = await client.channels.fetch(client.config.joinLog).catch((err) => {});
        const created = Math.round(member.user.createdTimestamp / 1_000);
        const joined = Math.round(Date.now() / 1_000);
        if (sendChannel?.type === 0 && sendChannel.guildId === member.guild.id && !exclude?.joinLog)
            sendChannel
                .send({
                    embeds: [
                        {
                            author: {
                                name: `${member.user.username} (${member.id}) Joined ♡`,
                                icon_url: member.displayAvatarURL(),
                            },
                            color: client.embedColor,
                            description: `♡ Created: <t:${created}> (<t:${created}:R>)\n\n<t:${joined}> (<t:${joined}:R>)`,
                        },
                    ],
                })
                .catch((err) => {
                    client.error(err);
                    setTimeout(() => this.fn(member, { joinChannel: true }), 2000);
                });
        if (client.config.joinChannel && !exclude?.joinChannel) {
            const channel = await client.channels.fetch(client.config.joinChannel).catch((err) => {});
            if (channel?.isTextBased())
                channel
                    .send({ content: `${client.config.joinMessage.replaceAll('{user}', `<@${member.id}>`)}`, files: [{ name: 't.png', attachment: client.config.joinImage }] })
                    .catch((err) => {
                        setTimeout(() => this.fn(member, { joinLog: true }), 2000);
                    });
            else client.error('Config joinChannel is invalid');
        }
    },
});
