const express = require('express')
const app = express()
const errorMidleware = require('./middleware/errors')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const bodyparser = require('body-parser')
const fileUpload = require('express-fileupload')
require('dotenv').config()

const cloudinary = require('cloudinary')


app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(bodyparser.urlencoded({ extended : true }))
app.use(fileUpload())

// DB
require('./db/connect')

//cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})


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