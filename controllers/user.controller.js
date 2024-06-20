const asyncHandler = require('express-async-handler');
const User = require('../models/User.model');
const response = require('../utils/response');

const updateUser = asyncHandler(async (req, res) => {
	const { name } = req.body;
	const id = req.user.id;

	if (!name) {
		res.end();
	}

	const updatedUser = await User.query().patchAndFetchById(id, { name });

	res
		.status(200)
		.json(response({ message: 'profile updated', data: updatedUser }));
});

module.exports = { updateUser };
