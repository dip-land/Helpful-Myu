import { type Client, Routes } from 'discord.js';
import { startDatabase } from '../handlers/database/index.js';
import { beta, commands } from '../index.js';
import { Event } from '../structures/event.js';

export default new Event({
	name: 'ready',
	on: false,
	async fn(client: Client<boolean>) {
		console.log(client.user?.username, 'online');
		startDatabase();
		//client.guilds.fetch(beta ? '981639333549322262' : '632717913169854495').then((g) => registerGuild(g));
		if (beta) {
			client.rest.put(Routes.applicationGuildCommands('996196343120928859', '981639333549322262'), { body: commands }).catch(console.error);
		} else {
			client.rest.put(Routes.applicationCommands('995370187626905611'), { body: commands }).catch(console.error);
			client.rest.put(Routes.applicationCommands('1055960319161282630'), { body: commands }).catch(console.error);
		}
	},
});
