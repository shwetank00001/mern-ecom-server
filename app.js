const express = require('express')
const app = express()
const errorMidleware = require('./middleware/errors')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cookieParser())


// DB
require('./db/connect')

// Routes
const products = require('./routes/productRoutes')
const user = require('./routes/userRoute')

app.use('/api/v1', products) 
app.use('/api/v1', user) 



app.use(errorMidleware)

module.exports = app