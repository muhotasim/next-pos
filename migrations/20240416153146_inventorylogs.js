/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('InventoryLog', function(table) {
      table.increments('InventoryLogID').primary();
      table.integer('Quantity').defaultTo(0);
      table.integer('type');//1=added, 2=sold, 3=returned
      table.integer('ProductID').unsigned().references('ProductID').inTable('Products');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('InventoryLog');
  };
  