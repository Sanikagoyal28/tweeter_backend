const express = require("express")
const tweetRoutes = express.Router();
const multerUpload = require("../middleware/multer")

const { authToken } = require("../middleware/verifyToken")
const TweetController = require("../controller/tweetController")

tweetRoutes.post("/create_tweet", authToken, multerUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 }
]), TweetController.createTweet)

tweetRoutes.post("/create_retweet", authToken, multerUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 }
]), TweetController.createRetweet)

tweetRoutes.post("/like_tweet", authToken, TweetController.likeTweet)
tweetRoutes.post("/bookmark_tweet", authToken, TweetController.bookmarkTweet)
tweetRoutes.get("/get_bookmark", authToken, TweetController.getBookmark)
tweetRoutes.get("/feeds/:count", authToken, TweetController.feeds)
tweetRoutes.get("/get_tweet/:tweetid", authToken, TweetController.getTweet)
tweetRoutes.delete("/delete_tweet/:tweetid", authToken, TweetController.deleteTweet)

module.exports = { tweetRoutes }