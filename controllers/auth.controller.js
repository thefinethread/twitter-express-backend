const asyncHandler = require('express-async-handler');
const User = require('../models/User.model');
const response = require('../utils/response');
const { generateToken } = require('../utils/generateToken');

const signUp = asyncHandler(async (req, res) => {
	const { name, username, email, password } = req.body;

	if (!name || !username || !email || !password) {
		res.status(400);
		throw new Error('Please provide all the fields');
	}

	//check existing user
	const existingUser = await User.query()
		.findOne({ email })
		.orWhere({ username });

	if (existingUser) {
		res.status(400);
		throw new Error('User with this email or username already exists');
	}

	const user = await User.query()
		.insert({ name, email, password, username })
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

const getMe = asyncHandler(async (req, res) => {
	res.status(200).json(response({ data: req.user }));
});

const logout = (req, res) => {
	res.clearCookie('auth-token');
	res.clearCookie('auth-user');
	res.status(201).json(response({ message: 'You are logged out' }));
};

module.exports = { signUp, login, getMe, logout };
