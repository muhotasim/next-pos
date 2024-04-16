/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('Products', function(table) {
      table.increments('ProductID').primary();
      table.string('Name').notNullable();
      table.string('Description');
      table.decimal('Price', 10, 2).notNullable();
      table.integer('QuantityAvailable').defaultTo(0);
      table.integer('CategoryID').unsigned().references('CategoryID').inTable('Categories');
      table.boolean('Active').defaultTo(1);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('Products');
  };
  