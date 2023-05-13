const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema.Types

const commentSchema = new mongoose.Schema({
    user_id: {
        type: ObjectId,
        ref: 'user',
        required: true
    },
    tweet_id: {
        type: ObjectId,
        ref: 'tweet',
        required: true
    },
    replying_to: [{
        type: String
    }],
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
    re_reply: {
        type: ObjectId,
        ref: 'comment'
    },
    like_count: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model("comment", commentSchema)