/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('Config', function(table) {
        table.increments('ConfigID').primary();
        table.string('ShopName').notNullable();
        table.string('ShopAddress').notNullable();
        table.string('Lang').notNullable();
        table.string('Phone').notNullable();
        table.string('Phone2').notNullable();
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('Config');
  
};
