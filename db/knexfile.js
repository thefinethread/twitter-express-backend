// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const { knexSnakeCaseMappers } = require('objection');
require('dotenv').config({ path: '../.env' });

module.exports = {
	development: {
		client: 'postgresql',
		connection: {
			database: process.env.DB_NAME,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			tableName: 'knex_migrations',
		},
		...knexSnakeCaseMappers,
	},

	production: {
		client: 'postgresql',
		connection: {
			database: process.env.DB_NAME,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			tableName: 'knex_migrations',
		},
		...knexSnakeCaseMappers,
	},
};
