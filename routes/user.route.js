const { updateUser } = require('../controllers/user.controller');
const { protectRoute } = require('../middlewares/auth.middleware');

const router = require('express').Router();

router.put('/', protectRoute, updateUser);

module.exports = router;
