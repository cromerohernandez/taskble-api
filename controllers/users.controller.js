const createError = require('http-errors')
const mailer = require('../config/mailer.config')

const Task = require('../models/task.model')
const User = require('../models/user.model')

const { dateToDays } = require('../helpers/dates.helper')

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000'

module.exports.create = (req, res, next) => {
  const { username, email, password } = req.body

  const user = new User({
    username: username,
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
      if (!user) {
        throw createError(404, 'user not found')
      } else {
        user.validated = true
        user.save()
          .then(validatedUser => {
            res.status(200).redirect(`${CORS_ORIGIN}/`)
          })
      }
    })
    .catch(next)
}

module.exports.checkLastAccess = (req, res, next) => {
  const lastAccessInDays = dateToDays(new Date(req.currentUser.lastAccess).getTime())
  const todayInDays = dateToDays(Date.now())

  if (lastAccessInDays < todayInDays) {
    User.findOne({ _id: req.currentUser.id })
      .then(user => {
        if (!user) {
          throw createError(404, 'user not found')
        } else {
          user.lastAccess = Date.now()
          user.save()
            .then(updatedUser => {
              res.status(200, 'last access checked')
              next()
            })
        }
      })
      .catch(next)
  } else {
    next()
  }
}

module.exports.profile = (req, res, next) => {
  User.findOne({ _id: req.currentUser.id })
    .populate('tasks')
    .then(user => {
      if (!user) {
        throw createError(404, 'user not found')
      } else {
        res.status(200).json(user)
      }
    })
    .catch(next)
}

module.exports.update = (req, res, next) => {  
  User.findOne({ _id: req.currentUser.id })
    .then(user => {
      if (!user) {
        throw createError(404, 'user not found')
      } else {
        ['username'].forEach(key => {
          if (req.body[key]) {
            user[key] = req.body[key]
          }
        })
        user.save()
          .then(updatedUser => {
            res.status(200).json(updatedUser)
          })
      }
    })
    .catch(next)
}

module.exports.requestNewPassword = (req, res, next) => {
  User.findOne({ _id: req.currentUser.id })
    .then(user => {
      if (!user) {
        throw createError(404, 'user not found')
      } else {
        mailer.sendUpdatePasswordEmail(user)
        res.status(200, 'email sent to update password').json()
      }
    })
    .catch(next)
}

module.exports.updatePassword = (req, res, next) => {  
  const { currentPassword, newPassword } = req.body

  User.findOne({ validationToken: req.params.token })
    .then(user => {
      if (!user) {
        throw createError(404, 'invalid current password or request')
      } else {
        return user.checkUserPassword(currentPassword)
          .then(match => {
            if (!match) {
              throw createError(400, 'invalid current password or request')
            } else {
              user.password = newPassword
              user.save()
                .then(updatedUser => {
                  res.status(200).json(updatedUser)
                })
            }
          })
      }
    })
    .catch(next)
}

module.exports.delete = (req, res ,next) => {
  Promise
    .all([
      User.findByIdAndDelete(req.currentUser.id),
      Task.deleteMany({ user: req.currentUser.id })
    ])
    .then(
      ([user, tasks]) => {
        if (!user) {
          throw createError(404, 'user not found')
        } else {
          res.status(204).json()
        }
      }
    )
    .catch(next)
}

module.exports.login = (req, res, next) => {
  const { email, password } = req.body
  
  if (!email || !password) {
    throw createError(400, 'missing credentials')
  }

  User.findOne({ email: email, validated: true})
    .then(user => {
      if (!user) {
        throw createError(404, 'invalid email or password')
      } else {
        return user.checkUserPassword(password)
          .then(match => {
            if (!match) {
              throw createError(400, 'invalid email or password')
            } else {
              req.session.user = user
              res.json(user)
            }
          })
      }
    })
    .catch(next)
}

module.exports.logout = (req, res) => {
  req.session.destroy()
  res.status(204).json()
}