// 3:12:56
const User = require('../model/userModel')
const ErrorHandler = require('../utils/errorHandler')
const sendEmail = require('../utils/sendEmail')
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
        console.log("User added to DB Sucessfully ")
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

async function logOut(req,res,next){
    await res.cookie("token",  null , {
        expires : new Date(Date.now()),
        httpOnly : true
    })

    res.status(200).json({
        success: true,
        message: "Logged Out !"
    })

}

async function forgotPassword(req,res,next){
    const user = await User.findOne({ email: req.body.email })   // we using email for  it since we are keeping the email as unique and the user will rec link on email

    if(!user){
        return next( new ErrorHandler("No User Found !", 404))
    }

    // get reset token from user schema

    const resetToken = user.generateResetPasswordToken()
    await user.save({ validateBeforeSave:false })

    const resetPasswordUrl = `${req.protocol}://${req.get(" ")}/api/v1/password/reset/${resetToken}`

    const message =    `Your password reset token :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email, then please ignore it. `


    try {
        await sendEmail({
            email : user.email,
            subject: "Password Recovery",
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} Successfully !!`
        })
    } catch (error) {
        user.resetPasswordToken = undefined
        user.recentPasswordExpire = undefined

        await user.save({ validateBeforeSave:false })

        return ( new ErrorHandler(error.message, 500))
    }
     

}



module.exports = {
    registerUser,
    loginUser,
    logOut,
    forgotPassword
}