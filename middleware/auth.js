async function isAuthenticatedUser(req, res, next){
    const token = req.cookie
    
    console.log(token)

    next()
}

module.exports = isAuthenticatedUser