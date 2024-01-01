import { Command } from '../../classes/Command.js';

export default new Command({
    name: 'announce',
    description: 'announce',
    disabled: true,
    category: 'utility',
    async prefixCommand({ message, client }) {
        client.channels.fetch('1104785386754023546').then((channel) => {
            if (channel?.type !== 5) return;
            channel.send({
                embeds: [
                    {
                        title: 'Announcement',
                        description: message.content.replace('.announce ', ''),
                        color: client.embedColor,
                    },
                ],
            });
        });
    },
});
