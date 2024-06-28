const { Model } = require('objection');

class Follow extends Model {
	static get tableName() {
		return 'follow';
	}

	static get idColumn() {
		return ['follower_id', 'following_id'];
	}

	static get relationMappings() {
		const User = require('./User.model');

		return {
			follower: {
				relation: Model.HasOneRelation,
				modelClass: User,
				join: {
					from: 'follow.followerId',
					to: 'user.id',
				},
			},
			following: {
				relation: Model.HasOneRelation,
				modelClass: User,
				join: {
					from: 'follow.followingId',
					to: 'user.id',
				},
			},
		};
	}
}

module.exports = Follow;
