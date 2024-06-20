const { Model } = require('objection');
const bcrypt = require('bcrypt');

class User extends Model {
	static get tableName() {
		return 'user';
	}

	// encrypt password
	async $beforeInsert() {
		this.password = await bcrypt.hash(this.password, 10);
	}

	//verify hash password
	async validatePassword(enteredPassword) {
		return await bcrypt.compare(enteredPassword, this.password);
	}
}

module.exports = User;
