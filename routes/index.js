const express = require("express")
const router = express.Router()

const { authRoutes } = require('./authRoutes')
const { tweetRoutes } = require('./tweetRoutes')
const {profileRoutes} = require('./profileRoutes')
const { commRoutes } = require("./commRoutes")

router.use('/auth', authRoutes)
router.use('/tweet', tweetRoutes)
router.use('/profile', profileRoutes)
router.use("/reply", commRoutes)

module.exports = router 