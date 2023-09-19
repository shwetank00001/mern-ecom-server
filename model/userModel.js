const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required : [true, "Please provide the Name"],
        maxLength : [30, "Name can not exceed 30 chars"],
        minLength : [3, "Name should have atleast 3 chars"],
    },
    email:{
        type: String,
        required : [true, "Please provide the Email"],
        unique: true,
        validator: [validator.email, "Please enter a valid Email"]
    },

    password:{
        type: String,
        required : [true, "Please provide the Email"],
        minLength : [8, "Name should have atleast 8 chars"],
        select: false
    },

    avatar:         
    {
        public_id : {
            type: String,
            required: true  
        },
        url : {
            type: String,
            required: true  
        }
    },
    role: {
        type: String,
        default: "user"
    },

    resetPasswordToken: String,
    recentPasswordExpired : String

})


module.exports = mongoose.model("User", userSchema)