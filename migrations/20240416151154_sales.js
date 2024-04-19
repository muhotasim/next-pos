/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('Sales', function(table) {
      table.increments('SaleID').primary();
      table.integer('CustomerID').unsigned().references('CustomerID').inTable('Customers').nullable();
      table.integer('EmployeeID').unsigned().references('EmployeeID').inTable('Employees');
      table.dateTime('SaleDate').defaultTo(knex.fn.now());
      table.decimal('TotalAmount', 10, 2).notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('Sales');
  };
