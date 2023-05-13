const express = require("express")
const commRoutes = express.Router();

const CommController = require("../controller/commentController")
const {authToken} = require("../middleware/verifyToken")

commRoutes.post("/tweet_reply", authToken, CommController.tweetComm)
commRoutes.get("/reply_replies/:replyid", authToken, CommController.getReplyReplies)

module.exports = {commRoutes}