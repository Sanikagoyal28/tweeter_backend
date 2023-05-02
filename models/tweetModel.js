const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema.Types

const tweetSchema = new mongoose.Schema({
    tweet_id: {
        type: ObjectId,
        required: true
    },
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
    }
})

module.exports = mongoose.model("tweets", tweetSchema)