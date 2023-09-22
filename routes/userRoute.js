const express = require('express')
const {registerUser, loginUser, logOut, forgotPassword, resetPassword} = require('../controllers/userController')

const route = express.Router()

route.post('/register', registerUser)
route.post('/login', loginUser)
route.post('/password/forgot', forgotPassword)
route.put('/password/reset/:token', resetPassword)
route.get('/logout', logOut)

module.exports = route