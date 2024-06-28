const {
	updateUser,
	followUser,
	unFollowUser,
	searchUsers,
	getUserProfile,
} = require('../controllers/user.controller');
const { protectRoute } = require('../middlewares/auth.middleware');

const router = require('express').Router();

router.put('/', protectRoute, updateUser);
router.get('/search', protectRoute, searchUsers);
router.get('/profile/:username', protectRoute, getUserProfile);

router.post('/follow', protectRoute, followUser);
router.delete('/unfollow', protectRoute, unFollowUser);

module.exports = router;
