const express = require("express")
const router = express.Router()

const { authRoutes } = require('./authRoutes')
const { tweetRoutes } = require('./tweetRoutes')

router.use('/auth', authRoutes)
router.use('/tweet', tweetRoutes)

module.exports = router 