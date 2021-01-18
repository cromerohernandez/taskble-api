const mongoose = require('mongoose')

let mongodbConnection = (process.env.NODE_ENV === 'dev') ? 'mongodb://localhost:27017/taskble' : process.env.MONGODB_URI

mongoose.connect(mongodbConnection, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.info(`Successfully connected to the database ${MONGODB_URI}`))
  .catch(error => console.error(`An error ocurred trying to connect to the database ${MONGODB_URI}`, error))

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
      console.log('Mongoose disconnected on app termination')
      process.exit(0)
  })
})