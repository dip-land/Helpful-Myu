import type { GuildMember } from 'discord.js';
import { client } from '../index.js';
import { Event } from '../structures/event.js';

export default new Event({
	name: 'guildMemberAdd',
	on: true,
	async fn(member: GuildMember) {
		const channels = [
			{ guild: '632717913169854495', channel: '1005657796802519192' },
			{ guild: '1054430033097277461', channel: '1054430038197534856' },
			{ guild: '981639333549322262', channel: '1003983050692116550' },
		];
		const channelID = channels.find(({ guild }) => guild === member.guild.id)?.channel as string;
		const sendChannel = await client.channels.fetch(channelID);
		if (sendChannel?.type !== 0) return;
		const created = Math.round(member.user.createdTimestamp / 1000);
		const joined = Math.round(Date.now() / 1000);
		sendChannel.send({
			embeds: [
				{
					author: {
						name: `${member.user.tag} (${member.id}) Joined ♡`,
						icon_url: member.displayAvatarURL(),
					},
					color: 0xfab6ec,
					description: `♡ Created: <t:${created}> (<t:${created}:R>)\n\n<t:${joined}> (<t:${joined}:R>)`,
				},
			],
		});
	},
});
