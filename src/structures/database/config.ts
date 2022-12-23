import { Model } from 'sequelize';

export default class Config extends Model {
	declare type: string;
	declare data: string;
}
