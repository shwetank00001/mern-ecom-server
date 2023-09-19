const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the product name"]
    },
    description: {
        type: String,
        required: [true, "Please enter product description"]
    },
    price : {
        type : Number,
        required: [true, "A Price is needed"],
        maxLength: [8, "Price can not exceed 8 characters"]
    },
    rating : {
        type: Number,
        default: 0
    },
    images : [
        {
        public_id : {
            type: String,
            required: true  
        },
        url : {
            type: String,
            required: true  
        }
    }],
    category : {
        type : String,
        required : [true, "Please enter product Category"],
    },
    stock : {
        type: Number,
        required : [true, "Please enter product Stock"],
        maxLength:[4, "Stock can not exceed 9999"],
        default: 1
    },
    numOfReviews : {
        type: Number,
        default: 0
    },
    reviews : [{
        name: {
            type: String,
            required: true
        },

        rating : {
            type: Number,
            required: true
        },
        comment : {
            type: String,
            required: true
        }
    }],
    createdAt: {
        type: Date,
        defaultValue: Date.now
    }

})


module.exports = mongoose.model("Product", productSchema)
// images in cloudinary, we get public_id and url from there