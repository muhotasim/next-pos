/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('SaleItems', function(table) {
      table.increments('SaleItemID').primary();
      table.integer('SaleID').unsigned().references('SaleID').inTable('Sales');
      table.integer('ProductID').unsigned().references('ProductID').inTable('Products');
      table.integer('Quantity').notNullable();
      table.decimal('RealPrice', 10, 2).notNullable();
      table.decimal('UnitPrice', 10, 2).notNullable();
      table.decimal('UnitDisAmount', 10, 2).notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('SaleItems');
  };