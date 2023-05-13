const { Errorhandler } = require("../middleware/errorHandler")
const User = require("../models/userModel")
const Tweet = require("../models/tweetModel")

const createTweet = async (req, res, next) => {
    try {

        const { text } = req.body
        console.log(req.files)

        const files = req.file ? req.file : null
        // const x = req.filesimage[0];
        // const y = req.filesvideo[0];

        // identify user from token
        const user = req.user
        const userid = user._id

        if (!user)
            return next(new Errorhandler("User not like_found", 400))

        if (user && !user.is_sign_up)
            return next(new Errorhandler("User is not Authenticated", 400))

        if (!text)
            return next(new Errorhandler("Text message is required", 400))

        let image = "", video = "";

        console.log(req.file)
        if (files) {
            const x = files.fieldname;

            if (x === "image") {
                image = 'uploads/' + files.originalname
            }
            if (x === "video") {
                video = 'uploads/' + files.originalname
            }
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
    const files = req.file ? req.file : null

    const user = req.user
    const userid = user._id

    if (!user)
        return next(new Errorhandler("User not like_found", 400))

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

    const new_tweet = {
        user_id: userid,
        text: '',
        image: '',
        video: '',
    }

    await Tweet.findByIdAndUpdate(new_tweet._id, {
        retweet: tweetid
    })

    return res.status(201).json({ msg: "Retweeted successfully", success: true })
}

const likeTweet = async (req, res, next) => {

    try {
        const { tweetid } = req.body;
        const user = req.user
        const userid = user._id

        if (!user)
            return next(new Errorhandler("User not like_found", 400))

        if (user && !user.is_sign_up)
            return next(new Errorhandler("User is not Authenticated", 400))

        if (!tweetid)
            return next(new Errorhandler("Tweet ID is not given", 400))

        const tweet = await Tweet.findById(tweetid)

        if (!tweet)
            return next(new Errorhandler("No tweet by this ID like_found", 400))

        // unlike tweet: find for that tweet in liked model if already present then delete it and make a bool
        const liked_tweet = await User.find({ _id: userid, liked: tweetid })

        let unliked = false;
        if (liked_tweet.length > 0) {
            unliked = true;
        }

        if (unliked) {
            //delete that tweet from user model
            await User.updateOne({ _id: userid }, {
                $pull: {
                    liked: tweetid
                }
            })

            // decrement that tweet count
            await Tweet.findByIdAndUpdate(tweetid, {
                $inc: {
                    like_count: -1
                }
            })

        }
        else {
            //increment the count
            await Tweet.findByIdAndUpdate(tweetid, {
                $inc: {
                    like_count: 1
                }
            })

            // add to user model
            await User.findByIdAndUpdate(userid, {
                $addToSet: {
                    liked: tweetid
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

const bookmarkTweet = async (req, res, next) => {
    try {
        const { tweetid } = req.body;
        const user = req.user
        const userid = user._id

        if (!user)
            return next(new Errorhandler("User not like_found", 400))

        if (user && !user.is_sign_up)
            return next(new Errorhandler("User is not Authenticated", 400))

        if (!tweetid)
            return next(new Errorhandler("Tweet ID is not given", 400))

        const tweet = await Tweet.findById(tweetid)

        if (!tweet)
            return next(new Errorhandler("No tweet by this ID like_found", 400))

        const bm_tweet = await User.find({ _id: userid, bookmark: tweetid })

        let unmarked = false;
        if (bm_tweet.length > 0) {
            unmarked = true;
        }

        if (unmarked) {
            await User.updateOne({ _id: userid }, {
                $pull: {
                    bookmark: tweetid
                }
            })
        }
        else {
            await User.findByIdAndUpdate(userid, {
                $addToSet: {
                    bookmark: tweetid
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

const getBookmark = async (req, res, next) => {
    try {
        const user = req.user
        const userid = user._id

        if (!user)
            return next(new Errorhandler("User not like_found", 400))

        if (user && !user.is_sign_up)
            return next(new Errorhandler("User is not Authenticated", 400))

        const bookmarks = await User.findOne({ _id: userid }, {
            bookmark: 1
        }).populate({
            path: 'bookmark', populate: {
                path: 'user_id'
            }
        });

        const liked = []
        const bookmarked = []
        for (var i = 0; i < bookmarks.bookmark.length; i++) {
            const like_found = await User.findOne({ _id: userid, liked: bookmarks.bookmark[i]._id })

            if (like_found) {
                liked.push(true)
            }
            else {
                liked.push(false)
            }

            const bm_found = await User.findOne({ _id: userid, bookmark: bookmarks.bookmark[i]._id })

            if (bm_found) {
                bookmarked.push(true)
            }
            else {
                bookmarked.push(false)
            }
        }

        return res.status(201).json({ success: true, msg: "Bookmarked tweets", bookmarks, liked, bookmarked })
    }
    catch (err) {
        return next(new Errorhandler(err))
    }
}

const feeds = async (req, res, next) => {
    try {
        const user = req.user
        const userid = user._id
        const { count } = req.params

        let start = count * 10;
        let end = start + 10;

        if (!user)
            return next(new Errorhandler("User not found", 400))

        if (user && !user.is_sign_up)
            return next(new Errorhandler("User is not Authenticated", 400))

        const tweets = await Tweet.find({ is_reply: false }).populate({
            path: 'retweet', populate: {
                path: 'user_id'
            }
        }).populate('user_id')

        const feeds = []
        for (var i = start; i < end; i++) {
            if (tweets[i])
                feeds.push(tweets[i])
            else
                feeds.push('')
        }

        const likes = []
        const bookmarks = []
        for (const feed of feeds) {
            const like_found = await User.findOne({ _id: userid, liked: feed._id })

            if (like_found) {
                likes.push(true)
            }
            else {
                likes.push(false)
            }

            const bm_found = await User.findOne({ _id: userid, bookmark: feed._id })

            if (bm_found) {
                bookmarks.push(true)
            }
            else {
                bookmarks.push(false)
            }
        }
        return res.status(201).json({ msg: "success", success: true, feeds, likes, bookmarks })
    }
    catch (err) {
        return next(new Errorhandler(err))
    }
}

const getTweet = async (req, res, next) => {
    try {
        const user = req.user
        const userid = user._id
        const { tweetid } = req.params

        if (!user)
            return next(new Errorhandler("User not found", 400))

        if (!tweetid)
            return next(new Errorhandler("Tweet ID is not given", 400))

        const tweet = await Tweet.findOne({ _id: tweetid }, { __v: 0, is_reply: 0, replying_to: 0 }).populate({
            path: 'replies', populate: {
                path: 'user_id'
            }
        }).populate('user_id', 'name, username, displaypic')

        const likes = []
        const bookmarks = []

        for (var i = 0; i < tweet.replies.length; i++) {
            const like_found = await User.findOne({ _id: userid, liked: tweet.replies[i]._id })

            if (like_found) {
                likes.push(true)
            }
            else {
                likes.push(false)
            }

            const bm_found = await User.findOne({ _id: userid, bookmark: tweet.replies[i]._id })

            if (bm_found) {
                bookmarks.push(true)
            }
            else {
                bookmarks.push(false)
            }
        }

        return res.status(201).json({ success: true, tweet, likes, bookmarks })
    }
    catch (err) {
        return next(new Errorhandler(err))
    }
}

const deleteTweet = async (req, res, next) => {
    try {
        const user = req.user
        const userid = user._id
        const { tweetid } = req.params

        if (!user)
            return next(new Errorhandler("User not found", 400))

        if (!tweetid)
            return next(new Errorhandler("Tweet ID is not given", 400))

        const tweet = await Tweet.findById(tweetid)
        if (!tweet)
            return next(new Errorhandler("Tweet not found", 400))

        await Tweet.deleteOne({ _id: tweetid })

        await User.findOneAndUpdate({ _id: userid }, {
            $pull: {
                tweets: tweetid
            }
        })

        return res.status(201).json({ success: true, msg: "Tweet deleted successfully" })
    }
    catch (err) {
        return next(new Errorhandler(err))
    }
}

module.exports = {
    createTweet,
    createRetweet,
    likeTweet,
    bookmarkTweet,
    getBookmark,
    feeds,
    deleteTweet,
    getTweet
}

// get my tweets : go in user module return all the tweets(populated) having that userid 