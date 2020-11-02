
exports.up = function (knex) {
  return knex.schema
    .table('links', function (table) {
      table.timestamps(true, true)
      table.dropColumn('date_added')
    })
};

exports.down = function (knex) {
  return knex.schema
    .table('links', function (table) {
      table.date('date_added')
      table.dropTimestamps()
    })
};
