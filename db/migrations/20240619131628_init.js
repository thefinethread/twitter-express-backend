/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema
		.createTable('user', (table) => {
			table.uuid('id', { primaryKey: true }).defaultTo(knex.fn.uuid());
			table.string('name').notNullable();
			table.string('email').notNullable().unique();
			table.string('password').notNullable();
			table.timestamps(true, true);
		})
		.createTable('post', (table) => {
			table.uuid('id', { primaryKey: true }).defaultTo(knex.fn.uuid());
			table.string('text').notNullable();
			table.string('image_url');
			table.uuid('user_id').references('id').inTable('user');
			table.timestamps(true, true);
		});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTableIfExists('post').dropTableIfExists('user');
};
