// 2:24:03
const User = require('../model/userModel')
const ErrorHandler = require('../utils/errorHandler')

const sendToken = require('../utils/jwtToken')

async function registerUser(req,res, next){

    try {
        const { name, email, password } = req.body 
        const user = await User.create({
            name,email,password, 
            avatar: {
                public_id : "sample",
                url: "sample url"
            }
        })

        sendToken(user, 200, res)
        console.log("User added to DB Sucessfully")
        
    } catch (error) {
        return next(new ErrorHandler("Error Creating a User", 400));

    }
}

async function loginUser(req,res, next){

    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email & Password", 400));
    }
  
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password !", 401));
    }

    sendToken(user, 200, res);
}

module.exports = {
    registerUser,
    loginUser
}