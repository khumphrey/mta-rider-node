const express = require('express')
const app = express()
var cors = require('cors')
const PORT = process.env.PORT || 3000
const mtaKey = process.env.MTA_KEY || 'your key that you should not commit with git here'
var mtaGtfs = require('mta-gtfs')
var mta = new mtaGtfs({ key: mtaKey })

// add allow all origins
app.use(cors())

// example query domain/stops?ids=[101,103,110]
app.get('/stops', (req, res, next) => {
  const query = req.query.ids ? JSON.parse(req.query.ids) : null

  mta.stop(query)
    .then(result => res.send(result))
    .catch(err => next(err))
})

// example query domain/stops/110
app.get('/stops/:id', (req, res, next) => {
  mta.stop(req.params.id)
    .then(result => res.send(result))
    .catch(err => next(err))
})

// example query domain/status?type=MetroNorth
app.get('/status', (req, res, next) => {
  // error unless type is subway, bus, BT, LIRR, MetroNorth
  const allowedTypes = ['subway', 'bus', 'BT', 'LIRR', 'MetroNorth']
  if (req.query.type && !allowedTypes.includes(req.query.type)) {
    const error = new Error('Your request was not processable because the parameters are not recognizable')
    error.status = 422
    return next(error)
  }

  mta.status(req.query.type)
    .then(result => res.send(result))
    .catch(err => next(err))
})

// example query domain/schedule?stopIds=[635,110]&feedId=1
app.get('/schedule', (req, res, next) => {
  // if not stop ids then error
  if (!req.query.stopIds) {
    const error = new Error('Your request was not processable because the parameters are not recognizable')
    error.status = 422
    return next(error)
  }

  mta.schedule(JSON.parse(req.query.stopIds), req.query.feedId)
    .then(result => res.send(result))
    .catch(err => next(err))
})

// for everything that doesn't match above
app.use('/', (req, res, next) => res.send('Let\'s learn about NYCT'))

// error handling middleware
app.use(function (err, req, res, next) {
  console.error(err.stack)
  const status = err.status || 500
  const message = err.message || 'I am broken...'
  res.status(status).send(message)
})

app.listen(PORT, () => console.log('Listening on port: ', PORT))