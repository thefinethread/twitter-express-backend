const {
	createPost,
	getPostsOfFollowingUsers,
	getPostsByUsername,
} = require('../controllers/post.controller');
const { protectRoute } = require('../middlewares/auth.middleware');

const router = require('express').Router();

router
	.route('/')
	.post(protectRoute, createPost)
	.get(protectRoute, getPostsOfFollowingUsers);

router.get('/list', protectRoute, getPostsByUsername);

module.exports = router;
