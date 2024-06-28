const asyncHandler = require('express-async-handler');
const Post = require('../models/Post.model');
const Follow = require('../models/Follow.model');
const response = require('../utils/response');
const User = require('../models/User.model');

const createPost = asyncHandler(async (req, res) => {
	const { content } = req.body;
	const userId = req.user.id;

	if (!content) {
		res.status(400);
		throw new Error('Please add some post content');
	}

	const post = await Post.query().insert({ content, userId }).returning('*');

	if (!post) {
		res.status(500);
		throw new Error('Server error');
	}

	res.status(201).json(response({ data: post }));
});

const getPostsOfFollowingUsers = asyncHandler(async (req, res) => {
	const followerId = req.user.id;

	const data = await Follow.query()
		.where({ follower_id: followerId })
		.join('post', 'post.user_id', 'follow.following_id')
		.join('user', 'user.id', 'post.user_id')
		.select(
			'post.id',
			'post.content',
			'post.createdAt',
			Follow.raw(`json_build_object(
        'id', "user".id,
        'name', "user".name,
				'username', "user".username
      ) as user`)
		)
		.orderBy('created_at', 'desc');

	res.status(200).json(response({ data }));
});

const getPostsByUsername = asyncHandler(async (req, res) => {
	const { username } = req.query;

	if (!username) {
		res.status(400);
		throw new Error('Missing username param');
	}

	const data = await Post.query()
		.join('user', 'post.user_id', 'user.id')
		.where('user.username', username)
		.select([
			'post.id',
			'post.content',
			'post.created_at',
			Follow.raw(`json_build_object(
			'id', "user".id,
			'name', "user".name,
			'username', "user".username
		) as user`),
		])
		.orderBy('created_at', 'DESC');

	res.status(200).json(response({ data }));
});

module.exports = { createPost, getPostsOfFollowingUsers, getPostsByUsername };
