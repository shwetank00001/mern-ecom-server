const express = require('express')
const {registerUser, loginUser, logOut, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile} = require('../controllers/userController')
const {isAuthenticatedUser} = require('../middleware/auth')

const route = express.Router()

route.post('/register', registerUser)
route.post('/login', loginUser)
route.post('/password/forgot', forgotPassword)
route.put('/password/reset/:token', resetPassword)
route.get('/logout', logOut)
route.get('/me', isAuthenticatedUser,  getUserDetails )
route.put('/password/update', isAuthenticatedUser, updatePassword)
route.put('/me/update', isAuthenticatedUser, updateProfile )

module.exports = route 