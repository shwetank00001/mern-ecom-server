const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
        required : [true, "Please provide the Password"],
        minLength : [8, "Password should have atleast 8 chars"],
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

// saving password in DB using bcrypt
userSchema.pre("save",  async function(next){

    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

// JWT token creating
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    })
}


//compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  

module.exports = mongoose.model("User", userSchema)