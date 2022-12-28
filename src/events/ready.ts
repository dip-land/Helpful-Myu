import { type Client, Routes } from 'discord.js';
import { beta, commands } from '../index.js';
import { Event } from '../structures/event.js';

export default new Event({
    name: 'ready',
    on: true,
    async fn(client: Client<boolean>) {
        console.log(client.user?.username, 'online');
        if (beta) {
            client.rest.put(Routes.applicationGuildCommands('996196343120928859', '981639333549322262'), { body: commands }).catch(console.error);
        } else {
            client.rest.put(Routes.applicationCommands('995370187626905611'), { body: commands }).catch(console.error);
        }
    },
});
