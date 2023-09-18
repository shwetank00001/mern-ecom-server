const Products = require('../model/productModel')


async function createProduct(req,res,next){
    const addProducts = await Products.create(req.body)
    res.status(200).json({
        success:true,
        addProducts
    })
}


const getAllProducts = async(req,res) => {
    const showProducts = await Products.find()
    res.status(200).json({
        success : true,
        showProducts    
    })
}

async function updateProduct(req,res){
    let product = Products.findById(req.params.id)
    if(!product){
        res.json("No Product Found !")
    }

    product = await Products.findByIdAndUpdate(req.params.id , req.body, { new: true, runValidators: true, useFindAndModify:false})
    res.status(200).json({
        success:true,
        product
    })
}

async function deleteProduct(req,res){
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
    deleteProduct
}