import { Partials } from 'discord.js';
import { Client } from './classes/Client.js';
import 'dotenv/config';

export const client = new Client({
    intents: ['Guilds', 'GuildMessages', 'MessageContent', 'GuildMembers', 'GuildMessageReactions'],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.once('ready', async () => {
    client.log(`${client.user?.username} online.`);
    await client.registerEvents();
    await client.registerCommands(['981639333549322262']);
    // const channel = await client.channels.fetch('9924198349838746213').catch((err) => {});
    // if (channel && channel?.isTextBased()) {
    //     //dual message way
    //     channel
    //         .send({ content: `${client.config.joinMessage.replaceAll('{user}', '<@439039443744063488>')}` })
    //         .then(() => {
    //             channel.send(client.config.joinImage).catch((err) => {});
    //         })
    //         .catch((err) => {});
    //     //embed way
    //     setTimeout(
    //         () =>
    //             channel
    //                 .send({
    //                     embeds: [
    //                         {
    //                             description: `### ${client.config.joinMessage.replaceAll('{user}', '<@439039443744063488>')}`,
    //                             image: { url: client.config.joinImage },
    //                             color: client.embedColor,
    //                         },
    //                     ],
    //                 })
    //                 .catch((err) => {}),
    //         100
    //     );
    // } else client.error('Config joinChannel is invalid');
});

client.login({ hm: process.env.HMTOKEN, nm: process.env.NMTOKEN, beta: process.env.BETATOKEN }[client.version]);
