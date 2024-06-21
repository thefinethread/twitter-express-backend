const { Model, ValidationError } = require('objection');
const bcrypt = require('bcrypt');

class User extends Model {
	static get tableName() {
		return 'user';
	}

	// JSON schema for validation
	static get jsonSchema() {
		return {
			type: 'object',
			required: ['name', 'username', 'email', 'password'],
			properties: {
				id: { type: 'string', format: 'uuid' },
				name: { type: 'string', minLength: 1, maxLength: 255 },
				username: { type: 'string', minLength: 1, maxLength: 255 },
				email: { type: 'string', format: 'email' },
				password: { type: 'string', minLength: 6 },
			},
		};
	}

	// Encrypt password before insert
	async $beforeInsert() {
		await super.$beforeInsert();
		this.password = await bcrypt.hash(this.password, 10);
	}

	// Verify hashed password
	async validatePassword(enteredPassword) {
		return await bcrypt.compare(enteredPassword, this.password);
	}
}

module.exports = User;
