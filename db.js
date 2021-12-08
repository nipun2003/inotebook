const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const mongoUri = process.env.MONGO_URI;

const connectToMongo = ()=>{
    mongoose.connect(
        mongoUri,()=>{
            console.log("Connected to mongo successfully");
        }
    )
}

module.exports = connectToMongo