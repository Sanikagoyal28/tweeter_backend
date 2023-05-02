
const express = require("express")
const authRoutes = express.Router()
const authController = require("../controller/authController")
const {authOtpToken} = require("../middleware/verifyToken")

authRoutes.post("/login", authController.login)
authRoutes.post("/forgot_pwd", authController.forgotPassword)
authRoutes.post("/otp_verify", authController.otpVerify)
authRoutes.post("/reset_pwd",authOtpToken, authController.resetPassword)
authRoutes.post("/signup", authController.signUp)
authRoutes.post("/signup_verify", authController.signVerify)
authRoutes.post("/sign_detail", authController.signUpTwo)

module.exports = { authRoutes }