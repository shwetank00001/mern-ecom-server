const Products = require('../model/productModel')
const ApiFeatures = require('../utils/apifeatures')
const ErrorHandler = require('../utils/errorHandler')



// will add more functions, like 1st fix cloudinary - main <3

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
    const productsCount = await Products.countDocuments()
    const apiFeature = new ApiFeatures(Products.find(), req.query).search().filter().pagination(resultPerPage) 
    try {
        const products = await apiFeature.query
        res.status(200).json({
            success : true,
            products,
            productsCount,
            resultPerPage
        })
        next()
    } catch (error) {
        console.log("Could not Get All the items, received the following error =>",{Message: error})
    }
}

const getSingleProduct = async(req,res,next) => {
    try {
        const product = await Products.findById(req.params.id)
        if(!product){
            // res.send("Product does not exist !").status(400)
            return next(new ErrorHandler("Product Not found", 404))    
        }
        res.status(200).json({
            sucess: true,
            product
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

    try {
        const { rating, comment, productID} = req.body
        const review ={
            user : req.user._id,
            name : req.user.name,
            rating: Number(rating),
            comment 
        };

        const product = await Products.findById(productID)
        const isReviewed = product.reviews.find( item => item.user.toString() === req.user._id.toString())

        if(isReviewed){
            product.reviews.forEach( item => {
                if(item.user.toString() === req.user._id.toString()){
                    item.rating= rating,
                    item.comment = comment
                }
            })
        }
        else{
            product.reviews.push(review)
            product.numOfReviews = product.reviews.length
        }


        let avg = 0
         product.reviews.forEach( item => {
            avg += item.rating
        }) ;
        product.ratings = avg / product.reviews.length


        await product.save({ validateBeforeSave: false})

        res.status(200).json({
            success: true
        })
    } catch (error) {
        console.log(error)
    }

}
    

// get all reviews

async function getProductReviews ( req, res, next ){

    const product = await Products.findById(req.query.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
}

async function deleteProductReview ( req, res , next){
    const product = await Products.findById(req.query.productId);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Products.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
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
    createProductReview,
    getProductReviews,
    deleteProductReview
}