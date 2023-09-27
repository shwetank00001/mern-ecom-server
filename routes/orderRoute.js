const express = require('express')
const { newOrder, getSingleOrder, myOrders} = require('../controllers/orderController')
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth')


const route = express.Router()

route.post('/order/new', isAuthenticatedUser,  newOrder)
route.get('/order/:id', isAuthenticatedUser ,getSingleOrder )
route.get('/orders/me', isAuthenticatedUser, myOrders )

module.exports= route