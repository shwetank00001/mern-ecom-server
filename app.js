const express = require('express')
const app = express()
const errorMidleware = require('./middleware/errors')

app.use(express.json())


// DB
require('./db/connect')

// Routes
const products = require('./routes/productRoutes')

app.use('/api/v1', products)
app.use(errorMidleware)

module.exports = app