// we always add a constructor (to initialize objext properties ) in a js class , also super is used to acess the constructor of the parent class and the values aswell.


class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message)
        this.statusCode = statusCode
        Error.captureStackTrace(this,this.constructor);
    }
    
}

module.exports = ErrorHandler