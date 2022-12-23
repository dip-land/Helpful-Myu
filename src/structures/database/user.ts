import { Model } from 'sequelize';

export default class User extends Model {
	declare id: string;
	declare xp: number;
	declare level: number;
	declare money: number;
	getXpToNextLevel() {
		return this.xp;
	}
	levelUp() {
		this.level++;
		this.save();
		return this.level;
	}
}
