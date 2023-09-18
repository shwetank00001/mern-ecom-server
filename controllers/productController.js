// 1:12:42

const Products = require('../model/productModel')
const ErrorHandler = require('../utils/errorHandler')


async function createProduct(req,res,next){
    const addProducts = await Products.create(req.body)
    res.status(200).json({
        success:true,
        addProducts
    })
}


const getAllProducts = async(req,res, next) => {
    const showProducts = await Products.find()
    res.status(200).json({
        success : true,
        showProducts    
    })
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
        console.log(error)
    }
}



async function updateProduct(req,res, next){
    let product = await Products.findById(req.params.id)
    if(!product){
        res.json("No Product Found !")
    }

    product = await Products.findByIdAndUpdate(req.params.id , req.body, { new: true, runValidators: true, useFindAndModify:false})
    res.status(200).json({
        success:true,
        product
    })
}

async function deleteProduct(req,res, next){
    const { id : prodID } = req.params
    const deleteItem = await Products.findByIdAndDelete({ _id: prodID })

    if(!deleteProduct){
        res.status(400).json("Item Not Present")
    }
    res.json(deleteItem)

}


module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getSingleProduct
}