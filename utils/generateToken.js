const jwt = require('jsonwebtoken');

const options = { expiresIn: '1d' };

const generateToken = (res, user) => {
	const payload = { id: user.id, name: user.name, email: user.email };

	const token = jwt.sign(payload, process.env.JWT_SECRET, options);

	setCookie(res, token);
};

const setCookie = (res, token) => {
	res.cookie('token', token, {
		maxAge: 24 * 60 * 60 * 1000, // 1 day
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
	});
};

module.exports = { generateToken };
