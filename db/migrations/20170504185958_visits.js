
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('links', (table) => {
      table.integer('visits')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('links', (table) => {
      table.dropColumn('visits')
    })
  ])
};
