const bcrypt = require('bcrypt')
const Task = require('../models/task.model')

const SALT_WORK_FACTOR = 10

function checkPassword (password, user) {
  return bcrypt.compare(password, user.password)
}

function checkPasswordFormat (password) {
  const letters = 'abcdefghijklmnñopqrstuvwxyz'
  const numbers = '0123456789'
  var check = {
    letters: false,
    numbers: false
  }
  password = password.toLowerCase()
  for (i=0; i<password.length; i++) {
    if (letters.indexOf(password.charAt(i))!=-1) {
      check.letters = true
      continue
    }
  }
  for (i=0; i<password.length; i++) {
    if (numbers.indexOf(password.charAt(i))!=-1) {
      check.numbers = true
    }
  }
  return (check.letters & check.numbers) ? true : false
}

function generateRandomToken () {
  const randomString = () => Math.random().toString(36).substring(2, 13)
  return randomString() + randomString() + randomString() + randomString()
}

function hashPassword (next, user) {
  if (user.isModified('password')) {
    bcrypt.genSalt(SALT_WORK_FACTOR)
      .then(salt => {
        return bcrypt.hash(user.password, salt)
          .then(hash => {
            user.password = hash
            next()
          })
      })
      .catch(error => next(error))
  } else {
    next()
  }
}

function setCurrentDate (next, task) {
  if (task.date.isModified('toDo')) {
    task.date.current = task.date.toDo
    next()
  } else {
    next()
  }
}

module.exports = {
  checkPassword,
  checkPasswordFormat,
  generateRandomToken,
  hashPassword,
  setCurrentDate
}