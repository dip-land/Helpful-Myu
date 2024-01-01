import type { GuildBan } from 'discord.js';
import { client } from '../index.js';
import { Event } from '../structures/event.js';
import { Config } from '../handlers/database/mongo.js';

export default new Event({
    name: 'guildBanAdd',
    async fn(ban: GuildBan) {
        try {
            //const sendChannel = await client.channels.fetch()?.data as string);
            // if (sendChannel?.type !== 0) return;
            // const created = Math.round(ban.user.createdTimestamp / 1_000);
            // const left = Math.round(Date.now() / 1_000);
            // if (sendChannel.guildId === ban.guild.id) {
            //     sendChannel.send({
            //         embeds: [
            //             {
            //                 author: {
            //                     name: `${ban.user.username} (${ban.user.id}) Left >~<`,
            //                     icon_url: ban.user.displayAvatarURL(),
            //                 },
            //                 description: `♡ Created: <t:${created}> (<t:${created}:R>)\n\n<t:${left}> (<t:${left}:R>)`,
            //             },
            //         ],
            //     });
            // }
        } catch (err) {
            console.log(client.timeCode('error'), err);
        }
    },
});
