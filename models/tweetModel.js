const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema.Types

const tweetSchema = new mongoose.Schema({
    user_id: {
        type: ObjectId,
        ref: 'user',
        required: true
    },
    text: {
        type: "String",
        required: true
    },
    image: {
        type: "String"
    },
    video: {
        type: "String"
    },
    retweet: {
        type: ObjectId,
        ref: 'tweet'
    },
    like_count: {
        type: Number,
        default: 0
    },
    is_liked: {
        type: Boolean,
        default: false
    },
    is_boomark: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("tweet", tweetSchema)