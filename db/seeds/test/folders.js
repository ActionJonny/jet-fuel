
exports.seed = function(knex, Promise) {
  return knex('links').del()
    .then(() => knex('folders').del())
    .then(() => {
      return Promise.all([
        knex('folders').insert({
          title: 'AOL',
          id:1
        }, 'id')
        .then(folder => {
          return knex('links').insert([
            { short_url: "TESTaol", long_url: "www.aol.com", visits:0, id:2  },
          ])
        })
      ])
    })
};
