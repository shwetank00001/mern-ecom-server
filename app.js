const express = require('express')
const app = express()
const errorMidleware = require('./middleware/errors')
var cors = require('cors')
const cookieParser = require('cookie-parser')
const cors = require('cors')


app.use(express.json())
app.use(cookieParser())
app.use(cors())
<<<<<<< HEAD
=======

>>>>>>> a19340b11a205dc4b1c37f1678e782569fd15778

// DB
require('./db/connect')

//MW
const notFound = require('./middleware/not-found')

// Routes
const products = require('./routes/productRoutes')  
const user = require('./routes/userRoute')
const order = require('./routes/orderRoute')


app.get('/', ( req, res ) => {
    res.status(200).json({
        success: true,
        message : "Welcome !"
    })
})

app.use('/api/v1', products) 
app.use('/api/v1', user) 
app.use('/api/v1', order) 



app.use(errorMidleware)
// app.use(notFound)


module.exports = app