import type { GuildMember } from 'discord.js';
import { client } from '../index.js';
import { Event } from '../classes/Event.js';

export default new Event({
    name: 'guildMemberRemove',
    async fn(member: GuildMember) {
        const sendChannel = await client.channels.fetch(client.config.leaveLog).catch((err) => {});
        const created = Math.round(member.user.createdTimestamp / 1000);
        const left = Math.round(Date.now() / 1000);
        if (sendChannel?.type === 0 && sendChannel.guildId === member.guild.id)
            sendChannel
                .send({
                    embeds: [
                        {
                            author: {
                                name: `${member.user.username} (${member.id}) Left >~<`,
                                icon_url: member.displayAvatarURL(),
                            },
                            description: `♡ Created: <t:${created}> (<t:${created}:R>)\n\n<t:${left}> (<t:${left}:R>)`,
                        },
                    ],
                })
                .catch((err) => {
                    client.error(err);
                    setTimeout(() => this.fn(member), 2000);
                });
    },
});
