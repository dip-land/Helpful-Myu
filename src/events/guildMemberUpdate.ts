import type { GuildMember } from 'discord.js';
import { Event } from '../classes/Event.js';

export default new Event({
    name: 'guildMemberUpdate',
    async fn(member: GuildMember, oldMember: GuildMember) {
        //console.log('member updated');
        //if (oldMember.premiumSinceTimestamp !== member.premiumSinceTimestamp) console.log(member.premiumSinceTimestamp, oldMember.premiumSinceTimestamp, 'user boosted? triggered');
    },
});
