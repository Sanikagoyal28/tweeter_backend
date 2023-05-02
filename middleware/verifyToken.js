const jwt = require("jsonwebtoken")
require('dotenv').config();
const User = require('../models/userModel')

const authToken = async (req, res, next) => {
    try {
        const token = req.header("accessToken") || req.header("Authorization")

        if (!token)
            return res.status(401).json({ success: false, msg: "Please login or signup before proceeding" });

        // const newToken = token.split(" ")[1]
        const newToken = token.substring(7)

        const verifyToken = jwt.verify(newToken, process.env.ACCESS_KEY, async (err, payload) => {
            if (err)
                return res.status(400).json({ success: false, msg: "Invalid or Token is expired" })

            else {
                const id = payload._id;

                const user = await User.findById(id)

                if (!user)
                    return res.status(400).json({ success: false, msg: "User by this email does not exists" })

                req.user = user

                next();
            }
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, msg: err })
    }
}

const authOtpToken = async (req, res, next) => {
    try {
        const token = req.header("accessToken") || req.header("Authorization")

        if (!token)
            return res.status(401).json({ success: false, msg: "Please login or signup before proceeding" });

        // const newToken = token.replace('/^Bearer\s+/', '')
        const newToken = token.substring(7)
        // console.log(token)
        // console.log(newToken)

        const verifyToken = jwt.verify(newToken, process.env.SECRET_KEY, async (err, payload) => {

            if (err) {
                return res.status(400).json({ success: false, msg: "Invalid or Token is expired" })
            }
            else {
                const id = payload._id;

                const user = await User.findById(id)
                if (!user)
                    return res.status(400).json({ success: false, msg: "User by this email does not exists" })

                next();
            }
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, msg: err })
    }
}

module.exports = { authToken, authOtpToken }