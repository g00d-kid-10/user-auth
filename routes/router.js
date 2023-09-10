const { Router } = require('express');
const route = Router();
const controller = require('../controller/controller')
const authMiddleware = require('../middleware/authMiddleware')

//routes
route.get('/', controller.home)
route.get('/user:id', authMiddleware.requireAuth, controller.classified_page)
route.get('/signup', controller.signup_page)
route.get('/login', controller.login_page)

route.post('/signup', controller.signup)
route.post('/login', controller.login)
route.get('/logout', controller.logout)

module.exports = route;