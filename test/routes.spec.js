process.env.NODE_ENV = 'test';

const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')

const server = require('../server')

const configuration = require('../knexfile')['test'];
const database = require('knex')(configuration);

chai.use(chaiHttp)

describe('Client Routes', () => {

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
    .get('/sad/sad')
    .end((err, response) => {
      response.should.have.status(404)
      done()
    })
  })
})

describe('API GET routes', () => {

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


  it('GET /api/v1/folders', (done) => {
    chai.request(server)
      .get('/api/v1/folders')
      .end((err, response) => {
        response.should.have.status(200)
        response.should.be.json
        response.body.should.be.a('array')
        response.body.length.should.equal(1)
        response.body[0].should.have.property('title')
        response.body[0].title.should.equal('AOL')
        response.body[0].should.have.property('id')
        response.body[0].id.should.equal(1)
        response.body[0].should.have.property('created_at')
        done()
      })
  })

  it('GET /api/v1/links', (done) => {
    chai.request(server)
      .get('/api/v1/links')
      .end((err, response) => {
        response.should.have.status(200)
        response.should.be.json
        response.body.should.be.a('array')
        response.body.length.should.equal(1)
        response.body[0].should.have.property('short_url')
        response.body[0].short_url.should.equal('TESTaol')
        response.body[0].should.have.property('id')
        response.body[0].id.should.equal(2)
        response.body[0].should.have.property('long_url')
        response.body[0].long_url.should.equal('www.aol.com')
        response.body[0].should.have.property('folder_id')
        response.body[0].folder_id.should.equal(1)
        response.body[0].should.have.property('visits')
        response.body[0].visits.should.equal(0)
        response.body[0].should.have.property('created_at')
        done()
      })
  })

  it('GET /api/v1/folders/1/links', (done) => {
    chai.request(server)
      .get('/api/v1/folders/1/links')
      .end((err, response) => {
        response.should.have.status(200)
        response.should.be.json
        response.body.should.be.a('array')
        response.body.length.should.equal(1)
        response.body[0].should.have.property('folder_id')
        response.body[0].folder_id.should.equal(1)
        response.body[0].should.have.property('visits')
        response.body[0].visits.should.equal(0)
        done()
      })
  })

  it('GET /aol', (done) => {
    chai.request(server)
      .get('/TESTaol')
      .end((err, response) => {
        response.should.have.status(200)
        response.should.be.html
        response.should.redirectTo('http://www.aol.com/')
        chai.request(server)
          .get('/api/v1/links')
          .end((err, response) => {
            response.body[0].should.have.property('visits')
            response.body[0].visits.should.equal(1)
            done()
        })
      })
    })
})

describe('API POST routes', () => {

  beforeEach((done) => {
    database.migrate.latest()
    .then(() => {
       database.seed.run()
       .then(() => {
       done()
     })
    })

  })

  afterEach((done) => {
    database.migrate.rollback()
    .then(() => {
      done()
    })
  })

  it('should create a new folder', (done) => {
        chai.request(server)
        .post('/api/v1/folders')
        .send({
          title: 'New Folder'
        })
        .end((err, response) => {
          response.should.have.status(201)
          response.body.should.be.a('object')
          response.body.should.have.property('id')
          chai.request(server)
          .get('/api/v1/folders')
          .end((err, response) => {
            response.should.have.status(200)
            response.should.be.json
            response.body.should.be.a('array')
            response.body.length.should.equal(2)
            response.body[1].should.have.property('title')
            response.body[1].title.should.equal('New Folder')
            response.body[1].should.have.property('id')
            done()
          })
        })
      })

  it('should create a new link', (done) => {
    chai.request(server)
      .post('/api/v1/links')
      .send({
        long_url: 'www.reddit.com',
        folder_id: 1
      })
      .end((err, response) => {
        response.should.have.status(201)
        response.body.should.be.a('object')
        response.body.should.have.property('short_url')
        response.body.should.have.property('long_url')
        response.body.long_url.should.equal('www.reddit.com')
        response.body.should.have.property('visits')
        response.body.visits.should.equal(0)
        chai.request(server)
          .get('/api/v1/links')
          .end((err, response) => {
            response.should.have.status(200)
            response.should.be.json
            response.body.should.be.a('array')
            response.body.length.should.equal(2)
            response.body[1].should.have.property('long_url')
            response.body[1].long_url.should.equal('www.reddit.com')
            response.body[1].should.have.property('folder_id')
            done()
          })
        })
    })


  // it('POST /api/v1/folders/1/links', (done) => {
  //   chai.request(server)
  //     .get('/api/v1/folders/1/links')
  //     .end((err, response) => {
  //
  //
  //       done()
  //     })
  // })
  //
  // it('POST /aol', (done) => {
  //   chai.request(server)
  //     .get('/TESTaol')
  //     .end((err, response) => {
  //
  //       done()
  //     })
  // })
})
