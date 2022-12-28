import { readFile, unlinkSync } from 'node:fs';
import { Config, Counter, Quote, User } from './mongo.js';

//Imported data is in GeoJSON format
export default function importData(path: string, deleteImportFile: boolean) {
    readFile(path, (error, data_) => {
        if (!data_ || error) return;
        const parsedData = JSON.parse(data_.toString());
        const keywords = [];

        for (const data of parsedData.features) {
            try {
                if (path.toLowerCase().includes('config')) Config.insertOne(data.properties);
                else if (path.toLowerCase().includes('counter')) Counter.insertOne(data.properties);
                else if (path.toLowerCase().includes('quote')) {
                    keywords.push(data.properties.keyword);
                    const counts: any = {};
                    keywords.forEach(function (x) {
                        counts[x] = (counts[x] || 0) + 1;
                    });
                    Quote.insertOne({
                        id: `${`${data.properties.keyword}`.toLowerCase()}${counts[data.properties.keyword]}`,
                        keyword: `${data.properties.keyword}`.toLowerCase(),
                        text: data.properties.text,
                        createdBy: data.properties.createdBy,
                        createdAt: new Date(data.properties.createdAt),
                    });
                } else if (path.toLowerCase().includes('user')) User.insertOne(data.properties);
            } catch (error) {}
        }
        if (deleteImportFile) unlinkSync(path);
    });
}
