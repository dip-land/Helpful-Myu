import type { GuildBan } from 'discord.js';
import { client } from '../index.js';
import { Event } from '../structures/event.js';

export default new Event({
	name: 'guildBanAdd',
	on: true,
	async fn(ban: GuildBan) {
		const channels = [
			{ guild: '632717913169854495', channel: '1005657796802519192' },
			{ guild: '1054430033097277461', channel: '1054430038197534856' },
			{ guild: '981639333549322262', channel: '1003983050692116550' },
		];
		const channelID = channels.find(({ guild }) => guild === ban.guild.id)?.channel as string;
		const sendChannel = await client.channels.fetch(channelID);
		if (sendChannel?.type !== 0) return;
		const created = Math.round(ban.user.createdTimestamp / 1000);
		const left = Math.round(Date.now() / 1000);
		sendChannel.send({
			embeds: [
				{
					author: {
						name: `${ban.user.tag} (${ban.user.id}) Left >~<`,
						icon_url: ban.user.displayAvatarURL(),
					},
					description: `♡ Created: <t:${created}> (<t:${created}:R>)\n\n<t:${left}> (<t:${left}:R>)`,
				},
			],
		});
	},
});
