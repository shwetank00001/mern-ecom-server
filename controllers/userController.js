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
        console.log("Error Creating a User", error)
    }

}

async function loginUser(req,res){
    const { email, password } = req.body
    if(!email || !password){
        res.json("Enter Email or Password")
    }

    const user = User.findOne( {email:email}).select("+password")

    if(!user){
            res.send("Invalid Email or Password")
    }

    
}

module.exports = {
    registerUser
}