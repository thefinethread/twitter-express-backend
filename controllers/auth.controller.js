const asyncHandler = require('express-async-handler');

const signUp = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		res.status(404);
		throw new Error('Please provide all the fields');
	}

	res.status(201).json(req.body);
});

module.exports = { signUp };
