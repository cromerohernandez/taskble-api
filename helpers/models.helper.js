const bcrypt = require('bcrypt')

const { dateToDays } = require('../helpers/dates.helper')

const SALT_WORK_FACTOR = 10

function calculateFinalPriority (task) {
  const finalPriority = task.userPriority
  const daysLate = dateToDays(task.date.current) - dateToDays(task.date.limit)
  if (daysLate > 0) {
    finalPriority += (daysLate / 4)
  }
  return finalPriority
}

function checkPassword (password, user) {
  return bcrypt.compare(password, user.password)
}

function checkPasswordFormat (password) {
  if (password.length > 0) {
    var check = {
      uppercase: false,
      lowercase: false,
      number: false,
      symbol: false
    }
    for (var i = 0; i<password.length; i++) {
      if (password.charCodeAt(i) >= 65 && password.charCodeAt(i) <= 90) {
        check.uppercase = true
      } else if (password.charCodeAt(i) >= 97 && password.charCodeAt(i) <= 122) {
        check.lowercase = true
      } else if (password.charCodeAt(i) >= 48 && password.charCodeAt(i) <= 57) {
        check.number = true
      } else {
        check.symbol = true
      }
    }
    return (check.uppercase === true && check.lowercase === true && check.number == true && check.symbol === true) ? true : false
  } else {
    return false
  }
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

function setCurrentDateToToDoDate (next, task) {
  if ( !task.date.current || (task.date.isModified('toDo') && dateToDays(task.date.current) < dateToDays(task.date.toDo)) ) {
    task.date.current = task.date.toDo
    next()
  } else {
    next()
  }
}

module.exports = {
  calculateFinalPriority,
  checkPassword,
  checkPasswordFormat,
  generateRandomToken,
  hashPassword,
  setCurrentDateToToDoDate
}