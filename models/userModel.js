const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        // required:true
    },
    is_sign_up:{
        type:Boolean,
        default:false
    },
    name:{
        type:String
    },
    username:{
        type:String,
        unique:true
    }
})

module.exports = mongoose.model("user", userSchema)