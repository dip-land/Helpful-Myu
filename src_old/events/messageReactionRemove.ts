import { Collection, type Guild, type MessageReaction, type User } from 'discord.js';
import { Event } from '../structures/event.js';
import { Reaction } from '../handlers/database/mongo.js';

export default new Event({
    name: 'messageReactionRemove',
    async fn(messageReaction: MessageReaction, user: User) {
        const reactionConfig = await Reaction.findOne({ message: messageReaction.message.id });
        if (!reactionConfig || user.bot) return;

        const timestamps = user.client.cooldowns.get('reactions') || user.client.cooldowns.set('reactions', new Collection()).get('reactions');
        if (timestamps.has(user.id) && Date.now() < timestamps.get(user.id) + 500) return user.send('Please do not spam the reactions.').catch((err) => {});
        timestamps.set(user.id, Date.now());
        setTimeout(() => timestamps.delete(user.id), 500);

        const index = reactionConfig.emojis.findIndex((emoji) => emoji.includes(messageReaction.emoji.id as string));
        const role = reactionConfig.roles[index];
        const member = await (await (messageReaction.message.guild as Guild).fetch()).members.fetch(user.id);
        member.roles.remove(role).catch((err) => {});
    },
});
