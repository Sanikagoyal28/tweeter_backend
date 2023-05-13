const { Errorhandler } = require("../middleware/errorHandler")
const User = require("../models/userModel")
const Comment = require("../models/commModel")
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

        const new_comment = await Comment.create({
            user_id: userid,
            tweet_id: tweetid,
            replying_to: tweet.user_id.username,
            text: text,
            image: image,
            video: video
        })

        await User.findByIdAndUpdate(userid, {
            $addToSet: { replies: new_comment._id }
        })

        await Tweet.findByIdAndUpdate(tweetid, {
            $addToSet: {
                replies: new_comment._id
            },
            $inc: {
                reply_count: 1
            }
        })

        return res.status(200).json({ success: true, msg: "Reply to a tweet added" })
    }
    catch (err) {
        return next(new Errorhandler(err))
    }
}

const likeComm = async (req, res, next) => {
    try {
        const { replyid } = req.body;
        const user = req.user
        const userid = user._id

        if (!user)
            return next(new Errorhandler("User not found", 400))

        if (!replyid)
            return next(new Errorhandler("Reply ID is not given", 400))

        const reply = await Comment.findById(replyid)

        if (!reply)
            return next(new Errorhandler("No reply by this ID found", 400))

        const liked_reply = await User.findOne({ _id: userid, liked_comm: replyid })

        let unliked = false;
        if (liked_reply) {
            unliked = true;
        }

        if (unliked) {
            await User.updateOne({ _id: userid }, {
                $pull: {
                    liked_comm: replyid
                }
            })

            await Comment.findByIdAndUpdate(replyid, {
                $inc: {
                    like_count: -1
                }
            })

        }
        else {
            await Comment.findByIdAndUpdate(replyid, {
                $inc: {
                    like_count: 1
                }
            })

            await User.findByIdAndUpdate(userid, {
                $addToSet: {
                    liked_comm: replyid
                }
            })
        }
        if (unliked)
            return res.status(201).json({ msg: "Unliked", success: true })
        else
            return res.status(201).json({ msg: "Liked", success: true })
    }
    catch (err) {
        return next(new Errorhandler(err))
    }
}

const bmComm = async (req, res, next) => {
    try {
        const { replyid } = req.body;
        const user = req.user
        const userid = user._id

        if (!user)
            return next(new Errorhandler("User not found", 400))

        if (!replyid)
            return next(new Errorhandler("Reply ID is not given", 400))

        const reply = await Comment.findById(replyid)

        if (!reply)
            return next(new Errorhandler("No reply by this ID found", 400))

        const bm_reply = await User.findOne({ _id: userid, bm_comm: replyid })

        let unmarked = false;
        if (bm_reply) {
            unmarked = true;
        }

        if (unmarked) {
            await User.updateOne({ _id: userid }, {
                $pull: {
                    bm_comm: replyid
                }
            })
        }
        else {
            await User.findByIdAndUpdate(userid, {
                $addToSet: {
                    bm_comm: replyid
                }
            })
        }
        if (unmarked)
            return res.status(201).json({ msg: "Bookmark removed", success: true })
        else
            return res.status(201).json({ msg: "Bookmark marked", success: true })
    }
    catch (err) {
        return next(new Errorhandler(err))
    }
}

const retweetComm = async (req, res, next) => {
    try {
        const { text, replyid } = req.body
        const files = req.file ? req.file : null
        const user = req.user
        const userid = user._id

        if (!user)
            return next(new Errorhandler("User not found", 400))

        if (!replyid)
            return next(new Errorhandler("Reply ID is not given", 400))

        const reply = await Comment.findById(replyid)

        if (!reply)
            return next(new Errorhandler("No reply by this ID found", 400))

    }
    catch (err) {
        return next(new Errorhandler(err))
    }
}

const replyComm = async (req, res, next) => {
    try {
        const user = req.user
        const userid = user._id
        const { text, replyid } = req.body
        const files = req.file ? req.file : null

        if (!user)
            return next(new Errorhandler("User not found", 400))

        if (!replyid)
            return next(new Errorhandler("Reply ID is not given", 400))

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

        const new_reply = await Comment.create({
            text,
            image,
            video

        })

        const reply = await Comment.updateOne({ _id: replyid }, {
            $addToSet: {
                replies: new_reply._id
            }
        })

    }
    catch (err) {
        return next(new Errorhandler(err))
    }
}

const getReplyReplies = async (req, res, next) => {
    try {

    }
    catch (err) {
        return next(new Errorhandler(err))
    }
}
module.exports = {
    tweetComm,
    likeComm,
    bmComm,
    retweetComm,
    replyComm
}