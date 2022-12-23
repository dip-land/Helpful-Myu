import { readFile, unlinkSync } from 'node:fs';
import Config from '../../structures/database/config.js';
import Counter from '../../structures/database/counter.js';
import Queue from '../../structures/database/queue.js';
import Quote from '../../structures/database/quote.js';
import User from '../../structures/database/user.js';

export default function importData(path: string, deleteImportFile: boolean) {
	readFile(path, (error, data_) => {
		if (!data_ || error) return;
		const parsedData = JSON.parse(data_.toString());
		for (const data of parsedData) {
			try {
				if (path.includes('config')) new Config({ type: data.type, data: data.data }).save();
				else if (path.includes('counters')) new Counter({ id: data.id, count: data.count }).save();
				else if (path.includes('song_queues')) new Queue({ id: data.id, platform: data.platform, duration: data.duration }).save();
				else if (path.includes('quotes')) new Quote({ keyword: data.keyword, text: data.text, createdBy: data.createdBy }).save();
				else if (path.includes('users')) new User({ id: data.id, xp: data.xp, level: data.level, money: data.money }).save();
			} catch (error) {}
		}
		if (deleteImportFile) unlinkSync(path);
	});
}
