const createError = require('http-errors')

const Task = require('../models/task.model')

module.exports.create = (req, res, next) => {
  const { keyword, title, description, priority, date,} = req.body

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