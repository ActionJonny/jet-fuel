
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('links', (table) => {
      table.date('date_added')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('links', (table) => {
      table.dropColumn('date_added')
    })
  ])
};
