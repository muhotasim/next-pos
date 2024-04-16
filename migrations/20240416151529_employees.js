/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('Employees', function(table) {
      table.increments('EmployeeID').primary();
      table.string('FirstName').notNullable();
      table.string('LastName').notNullable();
      table.string('Username').notNullable();
      table.string('Password').notNullable();
      table.string('Email');
      table.string('Phone');
      table.string('Role');
      table.boolean('Active').defaultTo(1);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('Employees');
  };
  