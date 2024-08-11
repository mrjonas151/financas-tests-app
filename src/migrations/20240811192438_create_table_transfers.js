/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('transfers', table => {
      table.increments('id').primary();
      table.string('description').notNullable();
      table.timestamp('date').notNullable();
      table.decimal('amount', 15, 2).notNullable();
      table.integer('acc_ori_id').references('id').inTable('accounts').notNullable();
      table.integer('acc_dest_id').references('id').inTable('accounts').notNullable();
      table.integer('user_id').references('id').inTable('users').notNullable();
    })
    .then(() => {
      return knex.schema.table('transactions', table => {
        table.integer('transfer_id').references('id').inTable('transfers');
      });
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .table('transactions', table => {
      table.dropColumn('transfer_id');
    })
    .then(() => {
      return knex.schema.dropTable('transfers');
    });
};
