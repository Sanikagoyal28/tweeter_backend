const express = require("express")
const profileRoutes = express.Router();
const multerUpload = require("../middleware/multer")

const { authToken } = require("../middleware/verifyToken")
const UserController = require("../controller/userController")

profileRoutes.get("/view_profile/:id", authToken, UserController.viewProfile)
profileRoutes.put("/edit_profile", authToken, multerUpload.single('displaypic'), UserController.editProfile)
profileRoutes.post("/follow", authToken, UserController.followUser)

module.exports = { profileRoutes }