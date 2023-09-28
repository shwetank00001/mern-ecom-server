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

// get single order using _id for a logged in user
exports.getSingleOrder = async ( req, res, next ) => {

    try {
        const order = await Order.findById(req.params.id).populate(
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


// logged in user's orders
exports.myOrders = async ( req, res, next ) => {

    try {
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

// get all orders for admin
exports.getAllOrders = async ( req, res, next ) => {

    try {

        const order = await Order.find()

        let totalAmount = 0
        order.forEach( (item) => {
            totalAmount += item.totalPrice
        })

            if(!order){
                return next( new ErrorHandler(`No Order Found with the id: ${req.params.id}`))
            }
        res.status(200).json({
            success : true,
            totalAmount,
            order
        })
    } catch (error) {
        res.send({
            success : false
        })
    }
}

// update order status -- admin route
exports.updateOrder = async ( req, res, next ) => {

    try {

        const order = await Order.findById(req.params.id)

        if (!order) {
            return next(new ErrorHandler("Order not found with this Id", 404));
          }
        if( order.orderStatus  === "Delivered"){
            return next( new ErrorHandler("Your item has already been Delivered !" , 404)) 
        }

        order.orderItems.forEach( async(item) => {
            await updateStock(item.product, item.quantity)
        })

        order.orderStatus = req.body.status;


        if( req.body.status === "Delivered"){
            order.deliveredAt = Date.now()
        }

        await order.save({ validateBeforeSave : false })


        res.status(200).json({
            success : true,
            totalAmount,
            order
        })
    } catch (error) {
        res.send({
            success : false,
            msg : error.message
        })
    }
}

async function updateStock(id, quantity) {
    const product = await Products.findById(id)

    product.stock -=  quantity

    await product.save({ validateBeforeSave: false })
}


// delete order- admins
exports.deleteOrder = async ( req, res, next ) => {

    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404));
    }
  
  
    res.status(200).json({
      success: true,
      message : `Item with ID: ${req.params.id} has been deleted`
    });
}
