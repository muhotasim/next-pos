/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('Customers', function(table) {
      table.increments('CustomerID').primary();
      table.string('Name').notNullable();
      table.string('Phone');
      table.boolean('Active').defaultTo(1);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('Customers');
  };