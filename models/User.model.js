const { Model, ValidationError } = require('objection');
const bcrypt = require('bcrypt');

class User extends Model {
	static get tableName() {
		return 'user';
	}

	static get relationMappings() {
		const Post = require('./Post.model');
		const Follow = require('./Follow.model');

		return {
			posts: {
				relation: Model.HasManyRelation,
				modelClass: Post,
				join: {
					from: 'user.id',
					to: 'post.user_id',
				},
			},

			followers: {
				relation: Model.HasManyRelation,
				modelClass: Follow,
				join: {
					from: 'user.id',
					to: 'follow.following_id',
				},
			},

			following: {
				relation: Model.HasManyRelation,
				modelClass: Follow,
				join: {
					from: 'user.id',
					to: 'follow.follower_id',
				},
			},
		};
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
