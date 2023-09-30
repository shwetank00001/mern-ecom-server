const express  = require('express')
const route = express.Router()
const { getAllProducts, createProduct, updateProduct, deleteProduct, getSingleProduct, createProductReview, getProductReviews, deleteProductReview } = require('../controllers/productController')
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth')

// route.get("/products", () => {
//     isAuthenticatedUser,
//     getAllProducts
// })

// 2:41:05 
route.get("/products", getAllProducts)
route.post("/admin/products/new", isAuthenticatedUser, authorizeRoles("admin"), isAuthenticatedUser, createProduct )
route.put("/admin/product/:id", isAuthenticatedUser, authorizeRoles("admin"),isAuthenticatedUser, updateProduct)
route.delete("/admin/product/:id", isAuthenticatedUser, authorizeRoles("admin"), isAuthenticatedUser, deleteProduct)
route.get("/product/:id", isAuthenticatedUser, getSingleProduct)
route.put("/reviews", isAuthenticatedUser, createProductReview)
route.get("/review", isAuthenticatedUser, getProductReviews)
route.delete("/review",isAuthenticatedUser, deleteProductReview)
module.exports = route

