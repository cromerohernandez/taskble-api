const express = require('express')
const router = express.Router()

const usersController = require('../controllers/users.controller')
const tasksController = require('../controllers/tasks.controller')

const authMiddleware = require('../middlewares/auth.middleware')

//users
router.post('/users/new', authMiddleware.isNotAuthenticated, usersController.create)
router.get('/users/:token/validate', usersController.validate)
router.get('/users/me', authMiddleware.isAuthenticated, tasksController.checkCurrentDate, usersController.checkLastAccess, usersController.profile)
router.patch('/users/me', authMiddleware.isAuthenticated, usersController.update)
router.post('/users/requestnewpassword', usersController.requestNewPassword)
router.patch('/users/:token/updatepassword', usersController.updatePassword)
router.delete('/users/me', authMiddleware.isAuthenticated, usersController.delete)

//tasks
router.post('/tasks/new', authMiddleware.isAuthenticated, tasksController.create)
router.get('/tasks/pending', authMiddleware.isAuthenticated, tasksController.checkCurrentDate, usersController.checkLastAccess, tasksController.getPending)
router.get('/tasks/daily/:date', authMiddleware.isAuthenticated, tasksController.checkCurrentDate, usersController.checkLastAccess, tasksController.getDaily)
router.get('/tasks/:id', authMiddleware.isAuthenticated, tasksController.checkCurrentDate, usersController.checkLastAccess, tasksController.get)
router.patch('/tasks/:id', authMiddleware.isAuthenticated, tasksController.update)
router.post('/tasks/:id/done', authMiddleware.isAuthenticated, tasksController.done)
router.delete('/tasks/:id', authMiddleware.isAuthenticated, tasksController.delete)

//sessions
router.post('/login', authMiddleware.isNotAuthenticated, usersController.login)
router.post('/logout', authMiddleware.isAuthenticated, usersController.logout)

module.exports = router