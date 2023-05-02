const mongoose = require("mongoose")
const {ObjectID} = mongoose.Schema.Types

const likeSchema = new mongoose.Schema({
    userid:{
        type:ObjectID,
        ref:'user',
        required:true
    },
    tweetid:{
        type:ObjectID,
        ref:'tweet',
        required:true
    }
})

module.exports = mongoose.model("liked", likeSchema)