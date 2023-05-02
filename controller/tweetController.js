const { Errorhandler } = require("../middleware/errorHandler")
const User = require("../models/userModel")
const Tweet = require("../models/tweetModel")
const multer = require("multer")
const multerUpload = require("../middleware/multer")
const Liked = require("../models/likeTweetModel")

// const uploadFile 

const createTweet = async (req, res, next) => {
    try {
        console.log(req.file)
        const { text } = req.body
        const files = req.file ? req.file : null

        // identify user from token
        const user = req.user
        const userid = user._id

        if (!user)
            return next(new Errorhandler("User not found", 400))

        if (user && !user.is_sign_up)
            return next(new Errorhandler("User is not Authenticated", 400))

        if (!text)
            return next(new Errorhandler("Text message is required", 400))

        let image = "", video = "";
        if (files) {
            const x = files[0].fieldname;

            if (x === "image") {
                image = originalname
            }
            if (x === "video") {
                video = originalname
            }

            console.log(files)
        }

        const new_tweet = await Tweet.create({
            user_id: userid,
            text: text,
            image: image,
            video: video
        })

        // populate tweet created by user in user model
        await User.findByIdAndUpdate(userid, {
            $addToSet: { tweets: new_tweet._id }
        })

        return res.status(200).json({ success: true, msg: "New Tweet created" })

    }
    catch (err) {
        return next(new Errorhandler(err))
    }
}

const createRetweet = async (req, res, next) => {
    const { tweetid, text } = req.body

    const user = req.user
    const userid = user._id

    if (!user)
        return next(new Errorhandler("User not found", 400))

    if (user && !user.is_sign_up)
        return next(new Errorhandler("User is not Authenticated", 400))

    if (!text)
        return next(new Errorhandler("Text message is required", 400))

    if (!tweetid)
        return next(new Errorhandler("Tweet ID for retweet is not given", 400))

    const tweet = await Tweet.findById(tweetid)

    if (!tweet)
        return next(new Errorhandler("No tweet by this ID found", 400))

    //upload image or video
    let image = null, video = null;
    const new_tweet = {
        user_id: userid,
        text: '',
        image: '',
        video: '',
    }

    await Tweet.findByIdAndUpdate(new_tweet._id, {
        $addToSet: {
            retweet: tweetid
        }
    })

    return res.status(201).json({ msg: "Retweeted successfully", success: true })
}

const likeTweet = async (req, res, next) => {

    try {
        const { tweetid } = req.body;
        const user = req.user
        const userid = user._id

        if (!user)
            return next(new Errorhandler("User not found", 400))

        if (user && !user.is_sign_up)
            return next(new Errorhandler("User is not Authenticated", 400))

        if (!tweetid)
            return next(new Errorhandler("Tweet ID is not given", 400))

        const tweet = await Tweet.findById(tweetid)

        if (!tweet)
            return next(new Errorhandler("No tweet by this ID found", 400))

        // unlike tweet: find for that tweet in liked model if already present then delete it and make a bool
        const liked_tweet = await Liked.find().populate({ path: 'tweetid' })
        // console.log(liked_tweet)

        let unliked = false;
        for (var i = 0; i < liked_tweet.length; i++) {
            if (liked_tweet[i].tweetid._id.equals(tweetid)) {
                unliked = true;
                break;
            }
        }
        // console.log(unliked)

        if (unliked) {
            await Liked.deleteOne({ tweetid: tweetid })

            await Tweet.findByIdAndUpdate(tweetid, {
                $inc: {
                    like_count: -1
                }
            })
        }
        else {
            await Liked.create({
                userid: userid,
                tweetid: tweetid
            })

            await Tweet.findByIdAndUpdate(tweetid, {
                $inc: {
                    like_count: 1
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

module.exports = {
    createTweet,
    createRetweet,
    likeTweet
}

// get my tweets : go in user module return all the tweets(populated) having that userid 