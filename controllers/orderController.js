const Order = require('../model/orderModel')
const Products = require('../model/productModel')
const ErrorHandler = require('../utils/errorHandler')


// creating order

exports.newOrder = async ( req, res, next ) => {

    try {
        const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body

        const order = await Order.create({
            shippingInfo, 
            orderItems, 
            paymentInfo, 
            itemsPrice, 
            taxPrice, 
            shippingPrice, 
            totalPrice,
            paidAt: Date.now(),
            user: req.user._id
        })

        res.status(200).json({
            success : true,
            message: "Order Created",
            order
        })

        
    } catch (error) {
        res.send({
            success : false,
            message : "Can Not Place Order"
        })
    }
}


exports.getSingleOrder = async ( req, res, next ) => {

    try {
        const order = await Order.findById(req.params. id).populate(
            "user", "name email"
            )

        // const order = await Order.find({ user: req.params._id })

            if(!order){
                return next( new ErrorHandler(`No Order Found with the id: ${req.params.id}`))
            }
        res.status(200).json({
            success : true,
            order
        })
    } catch (error) {
        res.send({
            success : false,
            message : "Can Not Get Single Order"
        })
    }
}

exports.myOrders = async ( req, res, next ) => {

    try {
        // const order = await Order.findById(req.params. id).populate(
        //     "user", "name email"
        //     )

        const order = await Order.find({ user: req.user._id })

            if(!order){
                return next( new ErrorHandler(`No Order Found with the id: ${req.params.id}`))
            }
        res.status(200).json({
            success : true,
            order
        })
    } catch (error) {
        res.send({
            success : false,
            message : "Can Not Get Single Order"
        })
    }
}