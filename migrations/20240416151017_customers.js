/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('Customers', function(table) {
      table.increments('CustomerID').primary();
      table.string('FirstName').notNullable();
      table.string('LastName').notNullable();
      table.string('Email');
      table.string('Phone');
      table.string('Address');
      table.boolean('Active').defaultTo(1);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('Customers');
  };