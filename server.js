const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const md5 = require('md5')

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Jet Fuel'
app.locals.folders = []

app.get('/', (request, response) => {
  fs.readFile(`${__dirname}/index.html`, (err, file) => {
    response.send(file)
  })
})

app.post('/folders', (request, response) => {
  const { title } = request.body
  const id = md5(title)

  app.locals.folders.push({ id, title })
  response.json({ id, title })
})

app.get('/folders', (request, response) => {
  const folders = app.locals.folders

  response.json(folders)
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})
