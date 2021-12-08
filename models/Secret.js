const mongoose = require('mongoose');
const { Schema } = mongoose;

const SecretSchema = new Schema({
    email : {
        type:String,
        required:true,
        unique :true
    },
    otp : {
        type:Number,
        required:true
    },
    created_at:{
        type:Date,
        default : Date.now
    }
});
const Secret = mongoose.model('secret',SecretSchema);
module.exports = Secret;