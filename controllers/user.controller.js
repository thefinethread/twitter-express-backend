const asyncHandler = require('express-async-handler');
const User = require('../models/User.model');
const response = require('../utils/response');
const Follow = require('../models/Follow.model');
const { raw } = require('objection');

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

	if (followingId === followerId) {
		res.status(400);
		throw new Error(`You can't follow yourself`);
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
		.select([
			'user.id',
			'user.name',
			'user.username',
			raw(
				`EXISTS (SELECT 1 FROM follow WHERE follow.following_id = "user".id AND
				follow.follower_id = ? ) AS "isFollowing"`,
				[currentUserId]
			),
		])
		.where((builder) => {
			builder
				.where('name', 'ilike', `%${searchTerm}%`)
				.orWhere('username', 'ilike', `%${searchTerm}%`);
		})
		.andWhere('id', '!=', currentUserId);

	res.status(200).json(response({ data: users }));
});

const getUserProfile = asyncHandler(async (req, res) => {
	const { username } = req.params;

	if (!username) {
		res.status(400);
		throw new Error('Missing username param');
	}

	const data = await User.query()
		.findOne({ username })
		.select(
			'user.id',
			'user.name',
			'user.username',
			'user.created_at',
			raw(
				'(SELECT COUNT(*) FROM post WHERE post.user_id = "user".id)::integer'
			).as('postsCount'),
			raw(
				'(SELECT COUNT(*) FROM follow WHERE follow.follower_id = "user".id)::integer'
			).as('followingCount'),
			raw(
				'(SELECT COUNT(*) FROM follow WHERE follow.following_id = "user".id)::integer'
			).as('followersCount')
		);

	res.status(200).json(response({ data }));
});

const getFollowers = asyncHandler(async (req, res) => {
	const { username } = req.params;
	const currentUserId = req.user.id;

	const user = await User.query().findOne({ username });

	const data = await Follow.query()
		.select(
			'follower.id',
			'follower.name',
			'follower.username',
			raw(
				`EXISTS(
				SELECT 1 FROM follow as f WHERE f.following_id = follower.id AND f.follower_id = ?)
				AS "isFollowing"`,
				[currentUserId]
			)
		)
		.joinRelated('follower')
		.where('follow.following_id', user.id);

	res.status(200).json(response({ data }));
});

const getFollowing = asyncHandler(async (req, res) => {
	const { username } = req.params;
	const currentUserId = req.user.id;

	const user = await User.query().findOne({ username });

	const data = await Follow.query()
		.select(
			'following.id',
			'following.name',
			'following.username',
			raw(
				`EXISTS
				(SELECT 1 FROM follow f WHERE f.following_id = following.id AND f.follower_id = ?)
				AS "isFollowing"`,
				[currentUserId]
			)
		)
		.joinRelated('following')
		.where('follow.follower_id', user.id);

	res.status(200).json(response({ data }));
});

module.exports = {
	updateUser,
	followUser,
	unFollowUser,
	searchUsers,
	getUserProfile,
	getFollowers,
	getFollowing,
};
