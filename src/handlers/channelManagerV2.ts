import type { Message } from 'discord.js';
import type { channelConfigData } from 'src/types/index.js';
import Config from '../structures/database/config.js';
import Counter from '../structures/database/counter.js';

export default async (message: Message<boolean>) => {
	const channelConfig = (await Config.findOne({ where: { type: `channel_${message.channelId}` } })) as Config;
	if (!channelConfig?.type || message.channel.type !== 0 || !message?.id) return;
	const channelConfigData: channelConfigData = JSON.parse(channelConfig?.data);
	const emojis: Array<string> = channelConfigData.emojis;
	const allowedURLS: Array<string> = channelConfigData.allowedURLs;
	const attachmentOnlyMode: boolean = channelConfigData.attachmentOnlyMode;
	const maxMessages: number = channelConfigData.maxMessages;
	const messages: Array<string> = channelConfigData.messages;
	const deleteAtMax: boolean = channelConfigData.deleteAtMax;
	//const bypassUsersImage: Array<string> = channelConfigData.bypassUsersImage;
	//const bypassUserMaxMessages: Array<string> = channelConfigData.bypassUsersMaxMessages;
	const maxMessagesEnabled: boolean = maxMessages >= 0;
	const counter: Counter = (await Counter.findOrCreate({ where: { id: message.channelId } }))[0];

	//If only image mode is enabled and a sticker is sent it will be deleted
	if (attachmentOnlyMode && message.stickers.size > 0) return deleteMessage(message, messages);

	//Check if message has attachments
	if (message.attachments.size > 0) {
		for (const [s, attachment] of message.attachments) {
			if (s) null;
			//If onlyImageModeEnabled and the attachment is not of contentType video or image the message will be deleted
			if (!attachment.contentType?.match(/video\/|image\/|webm/g) && attachmentOnlyMode) return deleteMessage(message, messages);
		}
		//If the message has not been deleted the finish function is called
		if ((await message.fetch())?.id) return finish(message, emojis, counter);
	}

	//Check if message has any text content
	if (message.content) {
		//Split the contents in to an array
		const contents: Array<string> = message.content.split(/[\n\r\s]+/);

		const checks: Array<number> = [];

		//Check if maxMessagesEnabled is true
		if (maxMessagesEnabled) {
			//Increase counter by 1 and save the new value
			counter.count++;
			counter.save();

			//check if the counters count is greater or equal to maxMessages and if it is delete the message
			if (counter.count >= maxMessages) {
				if (deleteAtMax) return deleteMessage(message, messages);
				message.reply(messages[Math.floor(Math.random() * messages.length)]).then((deleteMsg: Message<boolean>) => {
					setTimeout(() => {
						deleteMessage(deleteMsg, []);
					}, 5 * 60000);
				});
			}
		}

		for (const content of contents) {
			//Check if the content of contents contains an allowed URL
			if (allowedURLS.includes(content)) checks.push(1);
			else {
				//Fetch the content and checks if it is a video, image or webm
				const data = await fetch(content, { method: 'HEAD' }).catch((e) => {});
				if (data) {
					const type = data.headers.get('content-type');
					if (type?.match(/video\/|image\/|webm/g)) checks.push(1);
					else checks.push(0);
				} else checks.push(0);
			}
		}

		//if the content is not a video, image or webm and onlyImageModeEnabled is true delete the message
		if ((checks.includes(0) || checks.length === 0) && attachmentOnlyMode) return deleteMessage(message, messages);

		//if content is not a video, image or webm send empty array for emojis param else send emojis
		if (checks.includes(0)) return finish(message, emojis, counter, false);
		else return finish(message, [], counter);
	}
};

//Resets Counter and reacts with emojis
function finish(message: Message<boolean>, emojis: Array<string>, counter: Counter, reset = true) {
	//Reset Counter
	if (reset) {
		counter.count = 0;
		counter.save();
	}

	//React with emojis if there are any
	for (const emoji of emojis) {
		message.react(emoji).catch((e) => {});
	}
}

function deleteMessage(message: Message<boolean>, messages: Array<string>, minutes = 5) {
	message
		.delete()
		.then(() => {
			if (messages[0]) {
				message.channel.send(messages[Math.floor(Math.random() * messages.length)]).then((deleteMsg: Message<boolean>) => {
					setTimeout(() => {
						deleteMessage(deleteMsg, []);
					}, minutes * 60000);
				});
			}
		})
		.catch((e) => {
			console.log('error deleting message:', e);
			setTimeout(() => {
				message.delete().catch((e) => {
					console.log('error deleting message:', e);
				});
			}, 10000);
		});
}
