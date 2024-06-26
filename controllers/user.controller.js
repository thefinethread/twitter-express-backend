const asyncHandler = require('express-async-handler');
const User = require('../models/User.model');
const response = require('../utils/response');
const Follow = require('../models/Follow.model');

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

const followUser = asyncHandler(async (req, res) => {
	const { followingId } = req.query;
	const followerId = req.user.id;

	if (!followingId) {
		res.status(400);
		throw new Error('Missing query param: followingId');
	}

	// check if the user to be followed exists
	const followingUser = await User.query().findById(followingId);

	if (!followingUser) {
		res.status(404);
		throw new Error('User not found');
	}

	const followObj = { followerId, followingId };

	// check if follower_following relationship already exists
	const existingRelation = await Follow.query().findOne(followObj);

	if (existingRelation) {
		res.status(400);
		throw new Error('Already following this user');
	}

	// create a new relation
	await Follow.query().insert(followObj);

	res.status(200).json(response({}));
});

const unFollowUser = asyncHandler(async (req, res) => {
	const { followingId } = req.query;
	const followerId = req.user.id;

	if (!followingId) {
		res.status(400);
		throw new Error('Missing query param: followingId');
	}

	// check if the user to be unfollowed exists
	const followingUser = await User.query().findById(followingId);

	if (!followingUser) {
		res.status(404);
		throw new Error('User not found');
	}

	const deleteCount = await Follow.query()
		.delete()
		.where({ followingId, followerId });

	if (deleteCount === 0) {
		res.status(404);
		throw new Error('you are not following this user');
	}

	res.status(200).json(response({}));
});

const searchUsers = asyncHandler(async (req, res) => {
	const { searchTerm } = req.query;
	const currentUserId = req.user.id;

	if (!searchTerm) {
		res.status(400);
		throw new Error('Search term is required');
	}

	const users = await User.query()
		.where((builder) => {
			builder
				.where('name', 'ilike', `%${searchTerm}%`)
				.orWhere('username', 'ilike', `%${searchTerm}%`);
		})
		.andWhere('id', '!=', currentUserId)

		.leftJoin('follow', 'user.id', 'follow.following_id')
		.select([
			'user.id',
			'user.name',
			'user.username',
			User.raw(
				'CASE WHEN "follow"."follower_id" IS NOT NULL THEN true ELSE false END AS "isFollowing"'
			),
		]);

	res.status(200).json(response({ data: users }));
});

module.exports = { updateUser, followUser, unFollowUser, searchUsers };
