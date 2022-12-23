import { existsSync, readFile, writeFile } from 'node:fs';
import { sequelize } from './index.js';
import importData from './import.js';
import glob from 'glob';

export const startBackups = async () => {
	sequelize.beforeSync('', () => {
		readFile('./data/db.sqlite', (error, data) => {
			const backupID = Math.floor(Date.now() / 100000);
			if (existsSync(`./data/backups/db_${backupID}.sqlite`) || error) return;
			writeFile(`./data/backups/db_${backupID}.sqlite`, data.toString(), (error) => {
				if (error) console.log(error);
				else console.log(`Backup ${backupID} completed.`);

				glob('./data/imports/*.json', async (err: Error | null, paths: Array<string>) => {
					for (const path of paths) {
						importData(path, true);
					}
				});
			});
		});
	});
};
