const express = require('express')
const bodyParser = require('body-parser')
const md5 = require('md5')

const app = express()

const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('port', process.env.PORT || 3000)

    /*************  GET requests  **************/

app.get('/', (request, response) => {
  fs.readFile(`${__dirname}/index.html`, (err, file) => {
    response.send(file)
  })
})

app.get('/:short_url', (request, response) => {
  database('links').where('short_url', request.params.short_url).increment('visits', 1)
  .then(() => {
    database('links').where('short_url', request.params.short_url).select()
    .then(link => {
      if(link.length){
        const url = link[0].long_url
        response.redirect(`http://${url}`)
      }
    })
  })
    .catch(error => console.error(error))
})

app.get('/api/v1/folders', (request, response) => {
  database('folders').select()
    .then(folders => {
      response.status(200).json(folders)
    })
    .catch(error => {
      console.error('error: ', error)
    })
})

app.get('/api/v1/folders/:id/links', (request, response) => {
  database('links').where('folder_id', request.params.id).select()
    .then(links => {
      response.status(200).json(links)
    })
    .catch(error => {
      console.error('error: ', error)
    })
})

app.get('/api/v1/links', (request, response) => {
  database('links').select()
    .then(links => {
      response.status(200).json(links)
    })
    .catch(error => {
      console.error('error: ', error)
    })
})


  /*************  POST requests  **************/

app.post('/api/v1/links', (request, response) => {
  const { long_url, folder_id } = request.body
  const short_url = md5(long_url).substring(0, 5)
  const link = { long_url, short_url, folder_id, visits: 0 }

  database('links').insert(link, ['id', 'short_url', 'created_at', 'long_url', 'visits'])
  .then(link => {
    response.status(201).json(...link)
  })
  .catch(error => {
    console.error('error: ', error)
  })
})

// app.post('/api/v1/links', async (request, response) => {
//   const { long_url, folder_id } = request.body
//   const short_url = md5(long_url).substring(0, 5)
//   const link = { long_url, short_url, folder_id, visits: 0 }
//
//
// })

app.post('/api/v1/folders', (request, response) => {
  const folder = request.body

  database('folders').insert(folder, 'id')
  .then(folder => {
    response.status(201).json({ id: folder[0] })
  })
  .catch(error => {
    console.error('error: ', error)
  })
})

  /*************  DELETE requests  **************/

app.delete('/api/v1/links/:id', async (request, response) => {
  try {
    const link = await database('links').where('id', request.params.id).delete()
    response.status(200).send(`The link was removed from your folder.`)
  } catch (error) {
    response.status(404).send('We were not able to delete that link')
  }
})

app.listen(app.get('port'), () => {
  console.log(`port is running on ${app.get('port')}.`)
})

module.exports = app
