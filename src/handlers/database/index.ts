import { DataTypes, Sequelize } from 'sequelize';
import { beta, client } from '../../index.js';
import { startBackups } from './backup.js';
import Config from '../../structures/database/config.js';
import Counter from '../../structures/database/counter.js';
import Queue from '../../structures/database/queue.js';
import Quote from '../../structures/database/quote.js';
import User from '../../structures/database/user.js';

export const sequelize = new Sequelize({
	dialect: 'sqlite',
	logging: false,
	storage: './data/db.sqlite',
});

export const startDatabase = () => {
	sequelize
		.authenticate()
		.then(() => {
			console.log('Database online.');
			Quote.sync({ alter: true });
			startBackups().then(() => sequelize.sync());
		})
		.catch((e) => {
			console.log('Database Error', e);
		});
};

Config.init(
	{
		type: DataTypes.STRING,
		data: DataTypes.STRING,
	},
	{ sequelize, modelName: 'Config', timestamps: false }
);

Counter.init(
	{
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		count: DataTypes.INTEGER,
	},
	{ sequelize, modelName: 'Counters', timestamps: false }
);

Queue.init(
	{
		url: DataTypes.STRING,
		platform: DataTypes.STRING,
		duration: DataTypes.STRING,
	},
	{ sequelize, modelName: 'Song_Queue' }
);

Quote.init(
	{
		keyword: DataTypes.STRING,
		text: DataTypes.STRING,
		createdBy: DataTypes.STRING,
	},
	{ sequelize, modelName: 'Quotes', timestamps: true }
);
Quote.afterCreate('s', async (quote) => {
	const channelID = beta ? '1002785897005199480' : '1004144428019097600';
	const channel = await client.channels.fetch(channelID).catch((e) => {});
	const createdBy = await client.users.fetch(quote.createdBy);
	if (channel && channel?.isTextBased()) {
		channel.send({
			content: `\`Quote #${quote.id}  Keyword: ${quote.keyword}\` ${quote.text}\n\n<t:${Math.floor(quote.createdAt.getTime() / 1000)}:F>\nCreated by ${createdBy.tag} (${createdBy.id})`,
		});
	}
});
Quote.afterDestroy('s', async (quote) => {
	const channelID = beta ? '1002785897005199480' : '1004144428019097600';
	const channel = await client.channels.fetch(channelID).catch((e) => {});
	const createdBy = await client.users.fetch(quote.createdBy);
	if (channel && channel?.isTextBased()) {
		channel.send({
			content: `\`Quote #${quote.id} Deleted\` ${quote.text}\n\n<t:${Math.floor(Date.now() / 1000)}:F>\nCreated by ${createdBy.tag} (${createdBy.id})`,
		});
	}
});

User.init(
	{
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			unique: true,
		},
		xp: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		level: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		money: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
	},
	{ sequelize, modelName: 'Users', timestamps: false }
);
