import type { Message } from 'discord.js';
import { Event } from '../classes/Event.js';
import prefixCommand from '../handlers/prefixCommand.js';
import { Config } from '../handlers/database/mongoose.js';

export default new Event({
    name: 'messageCreate',
    async fn(message: Message<boolean>) {
        if (message.author.bot || message.author.system) return;

        //mouse "module"
        //nerdfriend id '591804440848367627'
        if (message.author.id === '591804440848367627' && Math.ceil(Math.random() * 32) === 12) message.react('🧀');

        //Prefix commands
        const config = await Config.findOne({ guild: message.guildId });
        let prefix = message.content.startsWith('.') ? '.' : undefined;
        if (config && config.prefixes) prefix = config.prefixes.find((p) => message.content.startsWith(p));
        if (!prefix) return;
        prefixCommand(message, prefix);
    },
});
