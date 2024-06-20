const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const protectRoute = asyncHandler(async (req, res, next) => {
	let token;

	if (req.cookies.token) {
		try {
			token = req.cookies.token;

			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			const user = await User.query().findById(decoded.id);

			if (!user) {
				res.status(401);
				throw new Error('User not found, please login again');
			}
			req.user = user;

			next();
		} catch (error) {
			res.status(401);
			throw new Error(error.message);
		}
	} else {
		res.status(401);
		throw new Error('Not authorized, no token');
	}
});

module.exports = { protectRoute };
