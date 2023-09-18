const express  = require('express')
const route = express.Router()
const { getAllProducts, createProduct, updateProduct, deleteProduct, getSingleProduct } = require('../controllers/productController')

route.get("/products", getAllProducts)
route.post("/products/new", createProduct)
route.put("/product/:id", updateProduct)
route.delete("/product/:id", deleteProduct)
route.get("/product/:id", getSingleProduct)

module.exports = route

