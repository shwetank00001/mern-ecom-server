const express = require('express')
const {registerUser, loginUser, logOut, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser} = require('../controllers/userController')
const {isAuthenticatedUser, authorizeRoles} = require('../middleware/auth')

const route = express.Router()

route.post('/register', registerUser)
route.post('/login', loginUser)
route.post('/password/forgot', forgotPassword)
route.put('/password/reset/:token', resetPassword)
route.get('/logout', logOut)
route.get('/me',   getUserDetails )
route.put('/password/update', isAuthenticatedUser, updatePassword)
route.put('/me/update', isAuthenticatedUser, updateProfile )
route.get('/admin/users', isAuthenticatedUser, authorizeRoles("admin"), getAllUsers)
route.get('/admin/user/:id', isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
route.put('/admin/user/:id', isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
route.delete('/admin/user/:id', isAuthenticatedUser, authorizeRoles("admin"), deleteUser)


module.exports = route 