const express = require("express")
const commRoutes = express.Router();
const multerUpload = require("../middleware/multer")

const { authToken } = require("../middleware/verifyToken")

const CommController = require("../controller/commentController")

commRoutes.post("/tweet_reply", authToken,  multerUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 }
]),CommController.tweetComm )

commRoutes.post("/like_reply", authToken, CommController.likeComm)
commRoutes.post("/bm_reply", authToken, CommController.bmComm)

module.exports = {commRoutes}