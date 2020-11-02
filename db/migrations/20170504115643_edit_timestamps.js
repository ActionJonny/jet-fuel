
exports.up = function (knex) {
  return knex.schema
    .table('links', function (table) {
      table.dropTimestamps()
    })
};

exports.down = function (knex) {
  return knex.schema
    .table('links', function (table) {
      table.timestamps()
    })
};
