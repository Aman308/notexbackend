const mongoose = require('mongoose');

const mongoURI = "mongodb://localhost:27017/notex"

const connectToMongo = () =>{
    mongoose.connect(mongoURI).then(()=>console.log("Connected to Mongo Sucessfully")).catch((e)=>console.log(e.message))
}

module.exports = connectToMongo;