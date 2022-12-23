import { Model } from 'sequelize';

export default class Queue extends Model {
	declare id: string;
	declare url: string;
	declare platform: string;
	declare duration: string;
}
