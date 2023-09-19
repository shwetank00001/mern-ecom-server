// 2:24:03
const User = require('../model/userModel')

async function registerUser(req,res){
    try {
        const { name, email, password } = req.body 
         
        const addUser = await User.create({
            name,email,password, 
            avatar: {
                public_id : "sample",
                url: "sample url"
            }
        })

        
        const token = addUser.getJWTToken( )

        res.status(200).json({
            success: true,
            token
        })
        console.log("User added to DB Sucessfully")
        
    } catch (error) {
        res.send("Error Creating a User", error).status(400)
    }

}

async function loginUser(req,res){
    const { email, password } = req.body;


  
    if (!email || !password) {
      return next(new ErrorHander("Please Enter Email & Password", 400));
    }
  
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHander("Invalid email or password", 401));
    }
  
    const isPasswordMatched = await user.comparePassword(password);
  
    if (!isPasswordMatched) {
      return next(new ErrorHander("Invalid email or password", 401));
    }

    const token = user.getJWTToken( )

    res.status(200).json({
        success: true,
        token
    })
}

module.exports = {
    registerUser,
    loginUser
}