const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
const server = require('../server.js')

chai.use(chaiHttp)

describe('API routes', () => {
  it('GET /api/v1/folders', (done) => {
    chai.request(server)
      .get('/api/v1/folders')
      .end((err, response) => {
        response.should.have.status(200)
        response.should.be.json
        response.body.should.be.a('array')
        response.body.length.should.equal(2)

        console.log(response);

        done()
      })
  })
})
