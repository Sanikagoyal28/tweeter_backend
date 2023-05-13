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
    bio: {
        type: String
    },
    my_profile: {
        type: Boolean,
        default: false
    },
    tweets: [{
        type: ObjectId,
        ref: 'tweet'
    }],
    liked: [{
        type: ObjectId,
        ref: 'tweet'
    }],
    bookmark: [{
        type: ObjectId,
        ref: 'tweet'
    }],
    followers: [{
        type: ObjectId,
        ref: 'user'
    }],
    following: [{
        type: ObjectId,
        ref: 'user'
    }],
    replies: [{
        type: ObjectId,
        ref: 'comment'
    }],
    liked_comm: [{
        type: ObjectId,
        ref: 'comment'
    }],
    bm_comm: [{
        type: ObjectId,
        ref: 'comment'
    }]
}, { timestamps: true })

module.exports = mongoose.model("user", userSchema)