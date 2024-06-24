const router = require('express').Router();
const {
	signUp,
	login,
	logout,
	getMe,
} = require('../controllers/auth.controller');
const { protectRoute } = require('../middlewares/auth.middleware');

router.post('/signup', signUp);
router.post('/login', login);
router.get('/get-me', protectRoute, getMe);
router.post('/logout', logout);

module.exports = router;
