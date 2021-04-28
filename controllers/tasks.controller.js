const createError = require('http-errors')

const Task = require('../models/task.model')

const { dateToDays } = require('../helpers/dates.helper')

module.exports.create = (req, res, next) => {
  const { keyword, title, description, userPriority, date} = req.body

  const task = new Task({
    user: req.currentUser.id,
    keyword: keyword,
    title: title,
    description: description,
    userPriority: userPriority,
    date: {
      toDo: date.toDo,
      limit: date.limit
    }
  })

  task.save()
    .then(task => res.status(201).json(task))
    .catch(next)
}

module.exports.checkCurrentDate = (req, res, next) => {
  const lastAccessInDays = dateToDays(new Date(req.currentUser.lastAccess).getTime())
  const todayInDays = dateToDays(Date.now())

  if (lastAccessInDays < todayInDays) {
    Task.updateMany(
      { user: req.currentUser.id, 'date.current': { $lt: Date.now() }, done: false },
      { 'date.current': new Date(todayInDays * 24 * 60 * 60 * 1000) }, ///////////////////////////////////////////////////////////////////////////////////////¿?¿?¿?
      { new: true }
    )
      .then(tasks => {
        if (!tasks) {
          next()
        } else {
          res.status(200, `${tasks.length} current task dates updated`)
          next()
        }
      })
      .catch(next)
  } else {
    next()
  }
}

module.exports.get = (req, res, next) => {
  Task.findOne({ _id: req.params.id })
    .then(task => {
      if (!task) {
        throw createError(404, 'task not found')
      } else if (task.user != req.currentUser.id) {
        throw createError(403, 'unauthorized user')
      } else {
        res.status(200).json(task)
      }
    })
    .catch(next)
}

module.exports.getDaily = (req, res, next) => {
  const dayInDays = dateToDays(req.params.date)

  Task.find(/*{ user: req.currentUser.id },*/ { 'date.current': new Date(dayInDays * 24 * 60 * 60 * 1000) }) /////////////////////////////////////////////////////¿?¿?¿?
    .then(tasks => {
      if (!tasks) {
        res.status(204, 'no tasks')
      } else {
        res.status(200).json(tasks)
      }
    })
    .catch(next)
}

module.exports.update = (req, res, next) => {  
  Task.findOne({ _id: req.params.id })
    .then(task => {
      if (!task) {
        throw createError(404, 'task not found')
      } else if (task.user != req.currentUser.id) {
        throw createError(403, 'unauthorized user')
      } else {
        ['keyword', 'title', 'description', 'userPriority', 'date', 'done'].forEach(key => {
          if (req.body[key]) {
            task[key] = req.body[key]
          }
        })
        task.save()
          .then(updatedTask => {
            res.status(200).json(updatedTask)
          })
      }
    })
    .catch(next)
}

module.exports.done = (req, res, next) => {  
  Task.findOne({ _id: req.params.id })
    .then(task => {
      if (!task) {
        throw createError(404, 'task not found')
      } else if (task.user != req.currentUser.id) {
        throw createError(403, 'unauthorized user')
      } else {
        task.done ? task.done = false : task.done = true
        task.save()
          .then(updatedTask => {
            res.status(200).json(updatedTask)
          })
      }
    })
    .catch(next)
}

module.exports.delete = (req, res ,next) => {
  Task.findByIdAndDelete(req.params.id)
    .then(task => {
      if (!task) {
        throw createError(404, 'task not found')
      } else if (task.user != req.currentUser.id) {
        throw createError(403, 'unauthorized user')
      } else {
        res.status(204).json()
      }
    })
    .catch(next)
}