const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
const server = require('../server')

chai.use(chaiHttp)

describe('Client Routes', () => {

  beforeEach((done) => {
    database.migrate.latest()
    .then(() => {
      return database.seed.run()
    })
    .then(() => {
      done()
    })

  })

  afterEach((done) => {
    database.migrate.rollback()
    .then(() => {
      done()
    })
  })

  it('should have a title of "Some URL Thing"', (done) => {
    chai.request(server)
    .get('/')
    .end((err, response) => {
      response.should.have.status(200)
      response.should.be.html
      done()
    })
  })

  it('should return a 404 for a non existent route', (done) => {
    chai.request(server)
    .get('/sad')
    .end((err, response) => {
      response.shoud.have.status(404)
      done()
    })
  })
})

describe('API Routes', () => {

})
