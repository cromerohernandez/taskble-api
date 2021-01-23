const express = require('express')
const router = express.Router()

const usersController = require('../controllers/users.controller')

const authMiddleware = require('../middlewares/auth.middleware')

//users
router.post('/users/new', authMiddleware.isNotAuthenticated, usersController.create)
router.get('/users/:token/validate', usersController.validate)
router.get('/users/me', authMiddleware.isAuthenticated, usersController.profile)
router.patch('/users/me', authMiddleware.isAuthenticated, usersController.update)
router.delete('/users/me', authMiddleware.isAuthenticated, usersController.delete)

//tasks

//sessions
router.post('/login', authMiddleware.isNotAuthenticated, usersController.login)
router.post('/logout', authMiddleware.isAuthenticated, usersController.logout)