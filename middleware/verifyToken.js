const jwt = require("jsonwebtoken")
require('dotenv').config();
const User = require('../models/userModel')

const authToken = async (req, res, next) => {
    try {
        const token = req.header("accessToken") || req.header("Authorizaation")

        if (!token)
            return res.status(401).json({ success: false, msg: "Please login or signup before proceeding" });

        const newToken = token.replace('/^Bearer\s+/', '')

        const verifyToken = jwt.verify(newToken, process.env.SECRET_KEY, async(err, payload) => {
            if (err)
                return res.status(400).json({ success: false, msg: "Invalid or Token is expired" })

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

const authOtpToken = async (req, res, next) => {
    try {
        const token = req.header("accessToken") || req.header("Authorizaation")

        if (!token)
            return res.status(401).json({ success: false, msg: "Please login or signup before proceeding" });

        const newToken = token.replace('/^Bearer\s+/', '')

        const verifyToken = jwt.verify(newToken, process.env.SECRET_KEY_TWO, async(res, err) => {
            if (err)
                return res.status(400).json({ success: false, msg: "Invalid or Token is expired" })

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

module.exports = {authToken, authOtpToken}