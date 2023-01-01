import type { GuildMember } from 'discord.js';
import { Event } from '../structures/event.js';

export default new Event({
    name: 'guildMemberUpdate',
    on: true,
    async fn(member: GuildMember, oldMember: GuildMember) {
        console.log('member updated');
        //if (oldMember.premiumSinceTimestamp !== member.premiumSinceTimestamp) console.log(member.premiumSinceTimestamp, oldMember.premiumSinceTimestamp, 'user boosted? triggered');
    },
});
