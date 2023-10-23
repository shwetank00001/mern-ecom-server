// 3:12:56
// will fix cloudinary later 8:05
const User = require('../model/userModel')
const ErrorHandler = require('../utils/errorHandler')
const sendEmail = require('../utils/sendEmail')
const sendToken = require('../utils/jwtToken')
const crypto = require("crypto")
const cloudinary = require("cloudinary");


async function registerUser(req,res, next){
    try {

        // const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        //     folder: "avatars",
        //     width: 150,
        //     crop: "scale",
        //   });

        const { name, email, password } = req.body 
        const user = await User.create({
            name,email,password, 
            avatar: {
                public_id: "myCloud.public_id",
                url: "myCloud.secure_url"
            }
        })
        sendToken(user, 200, res)
        console.log("User added to DB Sucessfully ")
    } catch (error) {
        console.log(error)
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

    const resetToken = user.generateResetPasswordToken();
    await user.save({ validateBeforeSave:false }); 

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

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


async function resetPassword( req, res, next ){
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Reset Password Token is Invalid or has been expired !",400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
}  


async function getUserDetails(req, res, next) {
    try {
      const user = await User.findById(req.user.id);
  
      if (!user) {
        throw new ErrorHandler("User does not exist");
      }
  
      res.status(200).json({
        success: true,
        user
      });
    } catch (error) {
      next(error);
    }
  }
  

async function updatePassword( req, res, next ){
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Old password is incorrect", 400));
    }
  
    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHandler("password does not match", 400));
    }
  
    user.password = req.body.newPassword;
  
    await user.save();
  
    sendToken(user, 200, res);
}


async function updateProfile( req, res, next ){

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }
    // will add avatar later

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new : true,
        runValidators:true,
        useFindAndModify : false
    })

    res.status(200)
    res.json({
        success : true
    })
}


// get all users- via admin- read total users


const getAllUsers = async(req, res, next) => {
    const users = await User.find()

    res.status(200).json({
        sucess : true,
        users
    })
}

const getSingleUser =  async(req, res, next) => {
    const user = await User.findById(req.params.id)

    if(!user){
        return next (new ErrorHandler(`User does not exist with the id ${req.params.id}`)   )
    }

    res.status(200).json({
        sucess : true,
        user
    })
}


async function updateUserRole( req, res, next ){

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }
    // will add avatar later

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new : true,
        runValidators:true,
        useFindAndModify : false
    })

    res.status(200)
    res.json({
        success : true
    })
}

async function deleteUser( req, res, next){

    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
      );
    }

    await user.deleteOne();
  
    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
}

module.exports = {
    registerUser,
    loginUser,
    logOut,
    forgotPassword,
    resetPassword,
    getUserDetails,
    updatePassword,
    updateProfile,
    getAllUsers,
    getSingleUser,
    updateUserRole,
    deleteUser
    

}