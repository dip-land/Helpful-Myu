import { ApplicationCommandOptionType, type User, type Client } from 'discord.js';
import { Command } from '../../structures/command.js';

export default new Command({
    name: 'help',
    description: 'Get some help :3',
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: 'query',
            description: 'Command you want to search for',
        },
        {
            type: ApplicationCommandOptionType.Boolean,
            name: 'hide',
            description: 'Hide the response',
        },
    ],
    aliases: ['commands', 'cmds'],
    category: 'utility',
    async slashCommand(interaction, options) {
        const query = options.getString('query');
        if (!query) {
            interaction.editReply({
                embeds: [
                    {
                        color: client.embedColor,
                        title: 'Help',
                        description: makeDefaultText(interaction.client, true),
                        timestamp: new Date().toISOString(),
                        footer: {
                            text: `Requested by ${interaction.user.username}`,
                            icon_url: interaction.user.displayAvatarURL(),
                        },
                    },
                ],
            });
        } else {
            interaction.editReply({
                embeds: [makeCommandEmbed(query, interaction.client, interaction.user)],
            });
        }
    },
    async prefixCommand(message, args) {
        if (!args[0]) {
            message.reply({
                embeds: [
                    {
                        color: client.embedColor,
                        title: 'Help',
                        description: makeDefaultText(message.client, false),
                        timestamp: new Date().toISOString(),
                        footer: {
                            text: `Requested by ${message.author.username}`,
                            icon_url: message.author.displayAvatarURL(),
                        },
                    },
                ],
            });
        } else {
            message.reply({
                embeds: [makeCommandEmbed(args[0], message.client, message.author)],
            });
        }
    },
});

function makeDefaultText(client: Client, slash: boolean, error?: boolean) {
    const text: Array<string> = [];
    const config: Array<string> = [];
    const quotes: Array<string> = [];
    const utility: Array<string> = [];
    const commands = client.legacyCommands;
    for (const collection of commands) {
        const cmdObj = collection[1].commandObject;
        if (cmdObj.category === 'config' && !config.includes(cmdObj.name)) {
            config.push(cmdObj.name);
            if (cmdObj.aliases[0]) config.push(cmdObj.aliases.join(', '));
        } else if (cmdObj.category === 'quotes' && !quotes.includes(cmdObj.name)) {
            quotes.push(cmdObj.name);
            if (cmdObj.aliases[0]) quotes.push(cmdObj.aliases.join(', '));
        } else if (cmdObj.category === 'utility' && !utility.includes(cmdObj.name)) {
            utility.push(cmdObj.name);
            if (cmdObj.aliases[0]) utility.push(cmdObj.aliases.join(', '));
        }
    }
    if (error) text.push("The Command that you tried to search for doesn't exist.");
    text.push('**Here are all the different commands.');
    text.push(`\n\nConfig:** ${config.join(', ')}\n**Quotes:** ${quotes.join(', ')}\n**Utility:** ${utility.join(', ')}\n\n`);
    //text.push(`**To see the details of a specific command type \`${slash === true ? '/help query:[command name]' : '.help [command name]'}\`**`);
    return text.join(' ');
}

function makeCommandEmbed(query: string, client: Client, user: User) {
    const command = client.legacyCommands.find((command) => command.commandObject.name === query || command.commandObject.aliases.includes(query));
    if (!command?.commandObject) {
        return {
            color: client.embedColor,
            title: 'Help',
            description: makeDefaultText(client, false, true),
            timestamp: new Date().toISOString(),
            footer: {
                text: `Requested by ${user.username}`,
                icon_url: user.displayAvatarURL(),
            },
        };
    }
    return {
        color: client.embedColor,
        title: command.commandObject.name,
        description: 'WIP',
        timestamp: new Date().toISOString(),
        footer: {
            text: `Requested by ${user.username}`,
            icon_url: user.displayAvatarURL(),
        },
    };
}
