import type { GuildMember } from 'discord.js';
import { client } from '../index.js';
import { Event } from '../structures/event.js';
import { Config } from '../handlers/database/mongo.js';

export default new Event({
    name: 'guildMemberRemove',
    async fn(member: GuildMember) {
        try {
            const sendChannel = await client.channels.fetch((await Config.findOne({ type: 'leaveLog' }))?.data as string);
            if (sendChannel?.type !== 0) return;
            const created = Math.round(member.user.createdTimestamp / 1000);
            const left = Math.round(Date.now() / 1000);
            if (sendChannel.guildId === member.guild.id) {
                sendChannel.send({
                    embeds: [
                        {
                            author: {
                                name: `${member.user.username} (${member.id}) Left >~<`,
                                icon_url: member.displayAvatarURL(),
                            },
                            description: `♡ Created: <t:${created}> (<t:${created}:R>)\n\n<t:${left}> (<t:${left}:R>)`,
                        },
                    ],
                });
            }
        } catch (err) {
            console.log(client.timeCode('error'), err);
        }
    },
});
