
exports.up = function (knex) {
  return knex.schema
    .table('links', function (table) {
      table.integer('visits')
    })
};

exports.down = function (knex) {
  return knex.schema
    .table('links', function (table) {
      table.dropColumn('visits')
    })
};
