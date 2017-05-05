
exports.seed = function(knex, Promise) {
  return knex('links').del()
    .then(() => knex('folders').del())
    .then(() => {
      return Promise.all([
        knex('folders').insert({
          title: 'Google'
        }, 'id')
        .then(folder => {
          return knex('links').insert([
            { short_url: "TESTgoogle", long_url: "www.google.com", folder_id: folder[0], visits:0 },
            { short_url: "TESTESPN", long_url: "www.espn.com", folder_id: folder[0], visits:0 }
          ])
        }),
        knex('folders').insert({
          title: 'AOL'
        }, 'id')
        .then(folder => {
          return knex('links').insert([
            { short_url: "TESTaol", long_url: "www.aol.com", folder_id: folder[0], visits:0  },
            { short_url: "TESTsomething", long_url: "www.something.com", folder_id: folder[0], visits:0 }
          ])
        })
      ])
    })
};
