import { type Interaction } from 'discord.js';
import { Event } from '../classes/Event.js';
import slashCommand from '../handlers/slashCommand.js';

export default new Event({
    name: 'interactionCreate',
    async fn(interaction: Interaction) {
        if (!interaction.id) return;
        if (interaction.isChatInputCommand()) return slashCommand(interaction);
    },
});
