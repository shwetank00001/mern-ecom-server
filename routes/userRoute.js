const express = require('express')
const {registerUser, loginUser, logOut} = require('../controllers/userController')

const route = express.Router()

route.post('/register', registerUser)
route.post('/login', loginUser)
route.get('/logout', logOut)

module.exports = route