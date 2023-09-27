const express = require('express')
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder} = require('../controllers/orderController')
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth')


const route = express.Router()

route.post('/order/new', isAuthenticatedUser,  newOrder)
route.get('/order/:id', isAuthenticatedUser ,getSingleOrder )
route.get('/orders/me', isAuthenticatedUser, myOrders )
route.get('/admin/orders', isAuthenticatedUser, authorizeRoles("admin"), getAllOrders )
route.put('/admin/order/:id', isAuthenticatedUser, authorizeRoles("admin"), updateOrder).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder)


module.exports= route