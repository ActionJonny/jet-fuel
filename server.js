const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const md5 = require('md5')

app.use(express.static('public'))

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Jet Fuel'

app.get('/', (request, response) => {
  fs.readFile(`${__dirname}/index.html`, (err, file) => {
    response.send(file)
  })
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})
