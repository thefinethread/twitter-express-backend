const { Model } = require('objection');
const knexfile = require('./knexfile');
const knex = require('knex');

const environment = process.env.NODE_ENV;

const setupDb = () => {
	const db = knex(knexfile[environment]);
	Model.knex(db);
};

module.exports = setupDb;
