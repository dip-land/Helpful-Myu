import type { GuildMember } from 'discord.js';
import { client } from '../index.js';
import { Event } from '../structures/event.js';
import { Config } from '../handlers/database/mongo.js';

export default new Event({
    name: 'guildMemberAdd',
    async fn(member: GuildMember) {
        try {
            const sendChannel = await client.channels.fetch((await Config.findOne({ type: 'joinLog' }))?.data as string);
            if (sendChannel?.type !== 0) return;
            const created = Math.round(member.user.createdTimestamp / 1_000);
            const joined = Math.round(Date.now() / 1_000);
            if (sendChannel.guildId === member.guild.id) {
                sendChannel.send({
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
                });
            }
        } catch (err) {
            console.log(client.timeCode('error'), err);
        }
    },
});
