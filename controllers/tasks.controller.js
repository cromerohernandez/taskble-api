const createError = require('http-errors')

const Task = require('../models/task.model')

module.exports.create = (req, res, next) => {
  const { keyword, title, description, priority, date} = req.body

  const task = new Task({
    user: req.currentUser.id,
    keyword: keyword,
    title: title,
    description: description,
    priority: priority,
    date: {
      toDo: date.toDo,
      limit: date.limit
    }
  })

  task.save()
    .then(task => res.status(201).json(task))
    .catch(next)
}

module.exports.get = (req, res, next) => {
  Task.findOne({ _id: req.params.id })
    .then(task => {
      if (!task) {
        throw createError(404, 'task not found')
      } else {
        res.status(200).json(task)
      }
    })
    .catch(next)
}

module.exports.update = (req, res, next) => {  
  Task.findOne({ _id: req.params.id })
    .then(task => {
      if (!task) {
        throw createError(404, 'task not found')
      } else {
        ['keyword', 'title', 'description', 'priority', 'date.toDo', 'date.limit', 'date.current', 'done'].forEach(key => {
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

module.exports.delete = (req, res ,next) => {
  Task.findByIdAndDelete(req.params.id)
    .then(task => {
      if (!task) {
        throw createError(404, 'task not found')
      } else {
        res.status(204).json()
      }
    })
    .catch(next)
}