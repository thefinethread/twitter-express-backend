const { Model } = require('objection');

class Post extends Model {
	static get tableName() {
		return 'post';
	}
}

module.exports = Post;
