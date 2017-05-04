
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('links', (table) => {
      table.timestamps(true, true)
      table.dropColumn('date_added')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('links', (table) => {
      table.dropTimestamps()
      table.date('date_added')
    })
  ])
};
