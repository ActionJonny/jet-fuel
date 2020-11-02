exports.up = function (knex) {
  return knex.schema
    .createTable('folders', function (table) {
      table.increments('id').primary()
      table.string('title')

      table.timestamps(true)
    })
    .createTable('links', function (table) {
      table.increments('id').primary()
        table.string('short_url')
        table.string('long_url')
        table.integer('folder_id').unsigned()
        table.foreign('folder_id')
          .references('folders.id')

        table.timestamps(true, true)
    })
};

exports.down = function (knex) {
  return knex.schema
    .dropTable('links')
    .dropTable('folders')
};
