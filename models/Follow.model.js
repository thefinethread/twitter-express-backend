const { Model } = require('objection');

class Follow extends Model {
	static get tableName() {
		return 'follow';
	}

	static get idColumn() {
		return ['follower_id', 'following_id'];
	}
}

module.exports = Follow;
