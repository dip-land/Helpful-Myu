import { Model } from 'sequelize';

export default class Quote extends Model {
	declare id: number;
	declare keyword: string;
	declare text: string;
	declare createdBy: string;
	declare createdAt: Date;
	declare updatedAt: Date;
}
