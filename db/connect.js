const mongoose = require('mongoose')
require('dotenv').config()

const URI = process.env.MONGO_URI


async function connected(){
    try {
        await mongoose.connect(URI, {
            useNewUrlParser:true
        })
        console.log("Connected to the Database")
    } catch (error) {
        console.log("Failed to Connect to the Mongo Database")
    }
}

connected()