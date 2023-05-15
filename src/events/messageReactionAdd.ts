import { Collection, type Guild, type MessageReaction, type User } from 'discord.js';
import { Event } from '../structures/event.js';
import { Reaction, type ReactionInterface } from '../handlers/database/mongo.js';

export default new Event({
    name: 'messageReactionAdd',
    async fn(messageReaction: MessageReaction, user: User) {
        const reactionConfig = await Reaction.findOne({ message: messageReaction.message.id });
        if (!reactionConfig || user.bot || !reactionConfig.roles[0]) return;

        const timestamps = user.client.cooldowns.get('reactions') || user.client.cooldowns.set('reactions', new Collection()).get('reactions');
        if (timestamps.has(user.id) && Date.now() < timestamps.get(user.id) + 500) return;
        timestamps.set(user.id, Date.now());
        setTimeout(() => timestamps.delete(user.id), 500);

        const groupedConfigs = [];
        const allRoles = [...reactionConfig.roles];
        const role = reactionConfig.roles[reactionConfig.emojis.findIndex((e) => e.includes(messageReaction.emoji.id as string))];
        const member = await (await (messageReaction.message.guild as Guild).fetch()).members.fetch(user.id);
        if (reactionConfig.requiredRole && reactionConfig.requiredRole !== 'null' && !member.roles.cache.has(reactionConfig.requiredRole)) return;
        if (reactionConfig.groupedMessages) {
            for (const group of reactionConfig.groupedMessages) {
                const [, , messageId] = group.split('/channels/')[1].split('/');
                const data = (await Reaction.findOne({ message: messageId })) as ReactionInterface;
                groupedConfigs.push(data);
                allRoles.push(...data.roles);
            }
        }
        if (reactionConfig.numberOfRoles) {
            let count = 1;
            for (const role of allRoles) {
                if (member.roles.cache.has(role)) count++;
                if (count > reactionConfig.numberOfRoles) {
                    member.roles.remove(role).catch((err) => {});
                    count--;
                }
            }
        }
        member.roles.add(role).catch((err) => {});
    },
});
