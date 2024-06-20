const {
	updateUser,
	followUser,
	unFollowUser,
} = require('../controllers/user.controller');
const { protectRoute } = require('../middlewares/auth.middleware');

const router = require('express').Router();

router.put('/', protectRoute, updateUser);

router.post('/follow', protectRoute, followUser);
router.delete('/unfollow', protectRoute, unFollowUser);

module.exports = router;
