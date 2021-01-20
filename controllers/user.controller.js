//const createError = require('http-errors')
const mailer = require('../config/mailer.config')

const User = require('../models/user.model')

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000'

module.exports.create = (req, res, next) => {
  const { email, password } = req.body

  const user = new User({
    email: email,
    password: password
  })

  user.save()
    .then(user => {
      mailer.sendValidateUserEmail(user)
      res.status(201).json(user)
    })
    .catch(next)
}

module.exports.validate = (req, res, next) => {
  User.findOne({ validationToken: req.params.token })
    .then(user => {
      if(user) {
        user.validated = true
        user.save()
          .then(() => {
            res.status(200).redirect(`${CORS_ORIGIN}/`)
          })
          .catch(next)
      } else {
        throw createError(404, 'User not found')
      }
    })
    .catch(next)
}