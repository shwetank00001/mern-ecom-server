// 2:20:30 

const Products = require('../model/productModel')
const ApiFeatures = require('../utils/apifeatures')
const ErrorHandler = require('../utils/errorHandler')

async function createProduct(req,res){
    try {
        const addProducts = await Products.create(req.body)
        res.status(200).json({
            success:true,
            addProducts
        })
        console.log("Item Sucessfully Added to the Database !")     
    } catch (error) {
        console.log("Could not insert the item, received the following error =>",{Message: error})
    }
}


const getAllProducts = async(req,res) => {
    
    const resultPerPage = 5
    const productCount = await Products.countDocuments()

    const apiFeature = new ApiFeatures(Products.find(), req.query).search().filter().pagination(resultPerPage) 
      
    try {
        const showProducts = await apiFeature.query
        res.status(200).json({
            success : true,
            showProducts,
            productCount
        })
    } catch (error) {
        console.log("Could not Get All the items, received the following error =>",{Message: error})
    }
}

const getSingleProduct = async(req,res,next) => {
    try {
        const singleProd = await Products.findById(req.params.id)

        if(!singleProd){
            // res.send("Product does not exist !").status(400)
            return next(new ErrorHandler("Product Not found", 404))    
        }
    
        res.status(200).json({
            sucess: true,
            singleProd
        })
    } catch (error) {
        res.send("Product does not exist !")
    }
}   



async function updateProduct(req,res, next){
    try {
        let product = await Products.findById(req.params.id)
        if(!product){
            return next(new ErrorHandler(`Could not Update the item on id :${req.params.id}`, 404))
        }
        product = await Products.findByIdAndUpdate(req.params.id , req.body, { new: true, runValidators: true, useFindAndModify:false})
        res.status(200).json({
            success:true,
            product
        })
        
    } catch (error) {
        console.log(`Could not Update the item with the id :${req.params.id}, received the following error =>`,{Message: error})
    }

}

async function deleteProduct(req,res){
    try {
        const { id : prodID } = req.params
        const deleteItem = await Products.findByIdAndDelete({ _id: prodID })
    
        if(!deleteProduct){
            res.status(400).json("Item Not Present")
        }
        res.json(deleteItem)
    } catch (error) {
        console.log("Can not delete the item with this id", {message: error})
    }
}


module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getSingleProduct
}