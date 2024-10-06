// const mongoose = require('mongoose');

// const mongoURI = "mongodb://localhost:27017/notex"

// const connectToMongo = () =>{
//     mongoose.connect(mongoURI).then(()=>console.log("Connected to Mongo Sucessfully")).catch((e)=>console.log(e.message))
// }

// module.exports = connectToMongo;
require('dotenv').config()
const mongoose = require('mongoose')

const connectDB = async () =>{
    // console.log(process.env.MONGO_URI)
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connect to MongoDB successfull")
    } catch (error) {
        console.log("failed " + error)
    }
}
module.exports = connectDB