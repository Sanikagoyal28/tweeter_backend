
const express = require("express")
const router = express.Router()
const authController = require("../controller/authController")
const {authOtpToken} = require("../middleware/verifyToken")

router.post("/login", authController.login)
router.post("/forgot_pwd", authController.forgotPassword)
router.post("/otp_verify", authController.otpVerify)
// router.post("/reset_pwd", authOtpToken(), authController.resetPassword)
router.post("/signup", authController.signUp)
router.post("/email_verify", authController.signVerify)
router.post("/sign_detail", authController.signUpTwo)

module.exports = { router }