const Products = require('../model/productModel')
const ApiFeatures = require('../utils/apifeatures')
const ErrorHandler = require('../utils/errorHandler')

async function createProduct(req,res, next){
    req.body.user = req.user.id
    try {
        const addProducts = await Products.create(req.body)
        res.status(200).json({
            success:true,
            addProducts
        })
        console.log("Item Sucessfully Added to the Database !")     
    } catch (error) {
        return next(new ErrorHandler("Product Cant Be Inserted", 404)) 
    }
}

const getAllProducts = async(req,res, next) => {
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
        next()
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



async function createProductReview( req, res, next){

    const { rating, comment, productId } = req.body;

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
  
    const product = await Products.findById(productId);
  
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
  
    let avg = 0;
  
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    product.ratings = avg / product.reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });
}


module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getSingleProduct,
    createProductReview
}