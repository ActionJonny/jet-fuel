const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const md5 = require('md5')

app.set('port', process.env.PORT || 3000)

app.get('/', (request, response) => {
  response.send('hello')
})
