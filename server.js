const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const md5 = require('md5')

const environment = 'development';
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('port', process.env.PORT || 3000)
// app.locals.title = 'Jet Fuel'
// app.locals.folders = []

app.get('/', (request, response) => {
  fs.readFile(`${__dirname}/index.html`, (err, file) => {
    response.send(file)
  })
})

app.post('/api/v1/folders', (request, response) => {
  const { title } = request.body
  const id = md5(title)

  app.locals.folders.push({ id, title })
  response.json({ id, title })
})

app.get('/api/v1/folders', (request, response) => {
  database('folders').select()
    .then(folders => {
      response.status(200).json(folders)
    })
    .catch(error => {
      console.error('error: ', error)
    });
})

app.post('/api/v1/url', (request, response) => {
  console.log(request);
})

app.get('/api/v1/url', (request, response) => {
  const url = app.locals.url

  response.json(url)
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})
