const asyncHandler = require('express-async-handler');
const User = require('../models/User.model');
const response = require('../utils/response');
const { generateToken } = require('../utils/generateToken');

const signUp = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		res.status(400);
		throw new Error('Please provide all the fields');
	}

	//check existing user
	const existingUser = await User.query().findOne({ email });

	if (existingUser) {
		res.status(400);
		throw new Error('User already exists');
	}

	const user = await User.query()
		.insert({ name, email, password })
		.returning('*');

	delete user.password;

	//generate token
	generateToken(res, user);

	res
		.status(201)
		.json(response({ message: 'your account has been created', data: user }));
});

const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		res.status(400);
		throw new Error('Please provide all the fields');
	}

	const user = await User.query().findOne({ email });

	console.log(user, password);

	if (user && (await user.validatePassword(password))) {
		generateToken(res, user);

		// exclude password in response
		delete user.password;

		res
			.status(200)
			.json(response({ message: 'You are logged in', data: user }));
	} else {
		res.status(401);
		throw new Error('Invalid email or password');
	}
});

const logout = (req, res) => {
	res.clearCookie('token');
	res.status(201).json(response({ message: 'You are logged out' }));
};

module.exports = { signUp, login, logout };
