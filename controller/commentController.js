const { Errorhandler } = require("../middleware/errorHandler")
const User = require("../models/userModel")
const Tweet = require("../models/tweetModel")

const tweetComm = async (req, res, next) => {
    try {
        const user = req.user
        const userid = user._id
        const { text, tweetid } = req.body
        const files = req.file ? req.file : null

        if (!user)
            return next(new Errorhandler("User not found", 400))

        if (!tweetid)
            return next(new Errorhandler("Tweet ID is not provided", 400))

        const tweet = await Tweet.findOne({ _id: tweetid }).populate('user_id')

        if (!tweet)
            return next(new Errorhandler("Tweet not found", 400))

        if (!text)
            return next(new Errorhandler("Text message is required", 400))

        let image = "", video = "";

        if (files) {
            const x = files.fieldname;

            if (x === "image") {
                image = 'uploads/' + files.originalname
            }
            if (x === "video") {
                video = 'uploads/' + files.originalname
            }
        }

        const new_comment = await Tweet.create({
            user_id: userid,
            replying_to: tweet.user_id.username,
            text: text,
            image: image,
            video: video,
            is_reply: true
        })

        await Tweet.findByIdAndUpdate(tweetid, {
            $addToSet: {
                replies: new_comment._id
            },
            $inc: {
                reply_count: 1
            }
        })

        await User.updateOne({ _id: userid }, {
            $addToSet: {
                tweets: new_comment._id
            }
        })

        return res.status(200).json({ success: true, msg: "Reply to a tweet added" })
    }
    catch (err) {
        return next(new Errorhandler(err))
    }
}

const getReplyReplies = async (req, res, next) => {
    try {
        const user = req.user
        const userid = user._id
        const { replyid } = req.params

        if (!user)
            return next(new Errorhandler("User not found", 400))

        if (!replyid)
            return next(new Errorhandler("Tweet ID is not provided", 400))

        const replies = await Tweet.findOne({ _id: replyid }).populate('replies')

        if (!replies)
            return next(new Errorhandler("Tweet not found", 400))

        return res.status(201).json({success:true, replies})

    }
    catch (err) {
        return next(new Errorhandler(err))
    }
}
module.exports = {
    tweetComm,
    getReplyReplies
}