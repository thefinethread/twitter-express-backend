const {
	createPost,
	getPostsOfFollowingUsers,
} = require('../controllers/post.controller');
const { protectRoute } = require('../middlewares/auth.middleware');

const router = require('express').Router();

router
	.route('/')
	.post(protectRoute, createPost)
	.get(protectRoute, getPostsOfFollowingUsers);

module.exports = router;
