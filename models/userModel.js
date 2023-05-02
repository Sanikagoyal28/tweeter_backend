const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        // required:true
    },
    is_sign_up: {
        type: Boolean,
        default: false
    },
    name: {
        type: String
    },
    username: {
        type: String,
        unique: true
    },
    displaypic: {
        type: String
    },
    tweets: {
        type: ObjectId,
        ref: 'tweet'
    },
    liked:{
        type: ObjectId,
        ref: 'liked' 
    }
})

module.exports = mongoose.model("user", userSchema)