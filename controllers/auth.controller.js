const asyncHandler = require('express-async-handler');
const User = require('../models/User.model');
const response = require('../utils/response');

const signUp = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		res.status(404);
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

	res
		.status(201)
		.json(response({ message: 'your account has been created', data: user }));
});

const login = asyncHandler(async (req, res) => {});

module.exports = { signUp };
