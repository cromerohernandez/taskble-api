require('dotenv').config()

const cookieParser = require('cookie-parser')
const createError = require('http-errors')
const express = require('express')
const logger = require('morgan')
const path = require('path')
const mongoose = require('mongoose')

require('./config/db.config')

const cors = require('./config/cors.config')
const session = require('./config/session.config')

/** 
 * Configure express
 */
const app = express()
app.use(cors)
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(session)

app.use((req, _, next) => {
  req.currentUser = req.session.user
  next()
})

/**
 * Configure routes
 */
const router = require('./config/routes.js')
app.use('/', router)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (error, req, res, next) {
  console.error('-' * 1000)
  console.error(error);

  res.status(error.status || 500);

  const data = {}

  if (error instanceof mongoose.Error.ValidationError) {
    res.status(400);

    for (field of Object.keys(error.errors)) {
      error.errors[field] = error.errors[field].message
    }

    data.errors = error.errors
  } else if (error instanceof mongoose.Error.CastError) {
    error = createError(404, 'Resource not found')
  } else if (error.code === 11000) {
    res.status(500)
    const key = Object.keys(error.keyValue)[0]
    data.errors = { [key]: `${key} already exists` }
  }

  data.message = error.message;
  res.json(data);
});

/** 
 * Listen on provided port
 */
const port = normalizePort(process.env.PORT || '5000');
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}