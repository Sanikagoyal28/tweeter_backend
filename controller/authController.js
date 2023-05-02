const User = require('../models/userModel')
const Otp = require("../models/otpModel")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const otpGenerator = require("otp-generator")
const mailer = require("../middleware/mailer")
const { Errorhandler } = require("../middleware/errorHandler")
require("dotenv").config();
const regexEmail = process.env.regexEmail
const regexPassword = process.env.regexPassword
const regexName = process.env.regexName
const {validEmail, validName, validPassword} = require("../middleware/regexValidate")

const refreshToken = async (req, res, next) => {
    const refreshtoken = req.body.refreshtoken

    if (!refreshtoken)
        return next(new Errorhandler("No Refresh token is provided", 401))

    refreshtoken.substring(7)

    jwt.verify(refreshtoken, process.env.REFRESH_KEY, async (err, payload) => {
        if (err)
            return next(new Errorhandler("", 401));

        else {
            const id = payload._id
            const user = await User.findById(id)

            if (!user)
                return next(new Errorhandler("User not found", 401))

            const new_accesstoken = jwt.sign({ id: user._id }, process.env.ACCESS_KEY, { expiresIn: "2d" })
            const new_refreshtoken = jwt.sign({ id: user._id }, process.env.REFRESH_KEY, { expiresIn: "5d" })

            return res.status(200).json({ success: true, accesstoken: new_accesstoken, refreshtoken: new_refreshtoken })

        }
    })
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            // can pass only one parameter in Error class 
            // return next( new Error("Email ID and Password is required"))
            return next(new Errorhandler("Email ID and Password is required", 400))
        }

        const user = await User.findOne({ email: email.toLowerCase() })

        if (!user || (user && !user.is_sign_up)) {
            return next(new Errorhandler("User by this email doesn't exist", 400))
        }

        const userPassword = await bcrypt.compare(password, user.password)

        if (!userPassword) {
            return next(new Errorhandler("Wrong password", 400))
        }

        // generate a jwt token {data: to pass in, security key, expiry time}
        const accesstoken = jwt.sign({ _id: user._id }, process.env.ACCESS_KEY, { expiresIn: "2d" })

        //generate a refresh token
        const refreshtoken = jwt.sign({ _id: user._id }, process.env.REFRESH_KEY, { expiresIn: "5d" })

        return res.status(200).json({ success: true, msg: "Welcome Back to Tweeter", accesstoken, refreshtoken })
    }
    catch (err) {
        return next(err)
    }
}

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return next(new Errorhandler("Email is required", 400))
        }

        if (!validEmail(email))
            return next(new Errorhandler("Invalid Email format", 400))

        const user = await User.findOne({ email: email.toLowerCase() })

        if (!user || (user && !user.is_sign_up)) {
            return next(new Errorhandler("User by this email doesn't exist", 400))
        }

        const mailedOtp = otpGenerator.generate(6,
            {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
                digits: true,
            })
        mailer.sendMail(email, mailedOtp)

        const otpExpire = Date.now() + 120000;

        const otpModel = await Otp.updateOne({ email: email.toLowerCase() },
            {
                $set: {
                    otp: mailedOtp.toString(),
                    expiry: otpExpire
                }
            }
        )

        if (otpModel.modifiedCount == 0) {
            await Otp.create({
                email: email.toLowerCase(),
                otp: mailedOtp.toString(),
                expiry: otpExpire
            })
        }

        return res.status(200).json({ success: true, msg: `Otp is sent successfully on ${email}` })
    }
    catch (err) {
        return next(err)
    }
}

const otpVerify = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        if (!email)
            return next(new Errorhandler("Email is not given", 400))

        if (!otp)
            return next(new Errorhandler("Otp is required", 400))

        const emailOtp = await Otp.findOne({ email: email.toLowerCase() })
        const user = await User.findOne({ email: email.toLowerCase() })

        if (!user || (user && !user.is_sign_up))
            return next(new Errorhandler("User by this email doesn't exist", 400))

        if (emailOtp.otp != otp)
            return next(new Errorhandler("Incorrect Otp", 400))

        if (emailOtp.expiry <= Date.now())
            return next(new Errorhandler("Otp expired", 400))

        await Otp.deleteOne({ email: email.toLowerCase() })

        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' })
        return res.status(200).json({ success: true, msg: "Otp verified successfully", token })
    }
    catch (err) {
        return next(err)
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!password)
            return next(new Errorhandler("Password is required", 400))

        if (!validPassword(password))
            return next(new Errorhandler("Invalid Password format", 400))

        const user1 = await User.findOne({ email: email.toLowerCase() })

        if (!user1 || (user1 && !user1.is_sign_up))
            return next(new Errorhandler("User by this email doesn't exist", 400))

        const check_pass = await bcrypt.compare(password, user1.password)

        if (check_pass)
            return next(new Errorhandler("Password is same as previous", 400))

        const pass = await bcrypt.hash(password, 12)

        const user = await User.updateOne({ email: email.toLowerCase() }, {
            $set: {
                password: pass
            }
        });
        const token = jwt.sign({ _id: user._id }, process.env.ACCESS_KEY, { expiresIn: "5d" })
        return res.status(200).json({ success: true, msg: "Password reset successfully", token })
    }
    catch (err) {
        return next(err)
    }
}

const signUp = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!(email))
            return next(new Errorhandler("Email is required", 400))

        if (!validEmail(email))
            return next(new Errorhandler("Invalid Email format", 400))

        const user = await User.findOne({ email: email.toLowerCase() })

        if (user && user.is_sign_up)
            return next(new Errorhandler("User by this email already exists", 400))

        const mailedOtp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
            digits: true,
        })

        const otpExpire = Date.now() + 120000;

        mailer.sendMail(email, mailedOtp)

        const otpSent = await Otp.updateOne({ email }, {
            $set: {
                otp: mailedOtp.toString(),
                expiry: otpExpire
            }
        })

        if (otpSent.modifiedCount == 0) {
            await Otp.create({
                email: email.toLowerCase(),
                otp: mailedOtp,
                expiry: otpExpire
            })
        }
        return res.status(200).json({ success: true, msg: "Please enter the Otp sent on your email" })
    }
    catch (err) {
        return next(new Errorhandler(err, 500))
    }
}

const signVerify = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        if (!email)
            return next(new Errorhandler("Email is not given", 400))

        if (!otp)
            return next(new Errorhandler("Otp is required", 400))

        const emailOtp = await Otp.findOne({ email: email.toLowerCase() })
        const prev_user = await User.findOne({ email: email.toLowerCase() })

        if (!emailOtp)
            return next(new Errorhandler("User not found by this email", 400))

        if (emailOtp.otp != otp)
            return next(new Errorhandler("Incorrect Otp", 400))

        if (emailOtp.expiry <= Date.now())
            return next(new Errorhandler("Otp expired", 400))

        let user;
        if (!prev_user) {
            user = await User.create({
                email: email.toLowerCase(),
                is_sign_up: false
            })
        }
        else {
            user = prev_user;
        }

        await Otp.deleteOne({ email: email.toLowerCase() })

        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" })
        return res.status(200).json({ success: true, msg: "Otp verified successfully", token: token })
    }
    catch (err) {
        return next(new Errorhandler(err))
    }
}

const signUpTwo = async (req, res, next) => {
    try {
        const { username, name, email, password } = req.body;

        if (!email)
            return next(new Errorhandler("Email is not given", 400))

        const find_user = await User.findOne({ email: email.toLowerCase() })

        if (find_user && find_user.is_sign_up)
            return next(new Errorhandler("Account already made", 400))

        if (!find_user)
            return next(new Errorhandler("User not found by this email", 400))

        if (!(username && name && password))
            return next(new Errorhandler("All inputs are required", 400))

        if (!validName(name))
            return next(new Errorhandler("Incorrect Name format", 400))

        if (!validPassword(password))
            return next(new Errorhandler("Incorrect password format", 400))

        const same_user_name = await User.findOne({
            username: username.toLowerCase()
        })
        if (same_user_name)
            return next(new Errorhandler("This Username already exists", 400))

        const pass = await bcrypt.hash(password, 12)

        const user = await User.findOneAndUpdate({ email: email.toLowerCase() }, {
            $set: {
                username: username.toLowerCase(),
                name: name.toLowerCase(),
                password: pass,
                is_sign_up: true
            }
        })

        const accesstoken = jwt.sign({ _id: user._id }, process.env.ACCESS_KEY, { expiresIn: "2d" })

        const refreshtoken = jwt.sign({ _id: user._id }, process.env.REFRESH_KEY, { expiresIn: "5d" })

        return res.status(200).json({ success: true, msg: `Welcome to Tweeter, ${name}`, accesstoken, refreshtoken })

    }
    catch (err) {
        return next(err)
    }
}

module.exports = {
    login,
    forgotPassword,
    otpVerify,
    resetPassword,
    signUp,
    signVerify,
    signUpTwo,
    refreshToken
}