const createError = require('http-errors')
const mailer = require('../config/mailer.config')
const Task = require('../models/task.model')

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
        return user.save()
      } else {
        throw createError(404, 'user not found')
      }
    })
    .then(validatedUser => {
      res.status(200).json(validatedUser).redirect(`${CORS_ORIGIN}/`)
    })
    .catch(next)
}

module.exports.profile = (req, res, next) => {
  User.findOne({ _id: req.currentUser.id })
    .populate('tasks')
    .then(user => {
      if (user) {
        res.status(200).json(user)
      } else {
        throw createError(404, 'user not found')
      }
    })
    .catch(next)
}

module.exports.update = (req, res, next) => {  
  User.findOne({ _id: req.currentUser.id })
    .then(user => {
      if(user) {
        ['password'].forEach(key => {
          if (req.body[key]) {
            user[key] = req.body[key]
          }
        })
        return user.save()
      } else {
        throw createError(404, 'user not found')
      }
    })
    .then(updatedUser => {
      res.status(200).json(updatedUser)
    })
    .catch(next)
}

module.exports.checkLastAccess = (req, res, next) => {
  //TODO
}

module.exports.delete = (req, res ,next) => {
  Promise
    .all([
      User.findByIdAndDelete(req.currentUser.id),
      Task.deleteMany({ user: req.currentUser.id })
    ])
    .then(
      ([user, tasks]) => {
        if(user) {
          res.status(204).json()
        } else {
          throw createError(404, 'user not found')
        }
      }
    )
    .catch(next)
}