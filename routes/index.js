const express = require("express")
const router = express.Router()

const { authRoutes } = require('./authRoutes')
const { tweetRoutes } = require('./tweetRoutes')
const {profileRoutes} = require('./profileRoutes')

router.use('/auth', authRoutes)
router.use('/tweet', tweetRoutes)
router.use('/profile', profileRoutes)

module.exports = router 