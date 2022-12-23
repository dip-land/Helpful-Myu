import { Model } from 'sequelize';

export default class Counter extends Model {
	declare id: string;
	declare count: number;
}
