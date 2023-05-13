const User = require("../models/userModel")
const { Errorhandler } = require("../middleware/errorHandler")

const viewProfile = async (req, res, next) => {
    try {
        const user = req.user
        const userid = req.params.id

        if (!user)
            return next(new Errorhandler("User not like_found", 400))

        if (user && !user.is_sign_up)
            return next(new Errorhandler("User is not Authenticated", 400))

        if (!userid)
            return next(new Errorhandler("User ID is not provided", 400))

        let profile;
        if (userid === user._id) {
            profile = await User.updateOne({ _id: userid }, { password: 0 }, {
                my_profile: true
            })
                .populate('tweets').populate('liked').populate('followers').populate('following')
        }
        else {
            profile = await User.findOneAndUpdate({ _id: userid }, { password: 0 }, {
                my_profile: false
            })
                .populate('tweets').populate('liked').populate('followers').populate('following')
        }

        const tweets = await User.find({ _id: userid }, { _id: 0, tweets: 1 })
        console.log(tweets)
        const likes = []
        const bookmarks = []
        for (const tweet of tweets) {
            const like_found = await User.findOne({ _id: userid, liked: tweet._id })

            if (like_found) {
                likes.push(true)
            }
            else {
                likes.push(false)
            }

            const bm_found = await User.findOne({ _id: userid, bookmark: tweet._id })

            if (bm_found) {
                bookmarks.push(true)
            }
            else {
                bookmarks.push(false)
            }
        }

        return res.status(201).json({ success: true, profile, likes, bookmarks })
    }
    catch (err) {
        return next(new Errorhandler(err))
    }
}

const editProfile = async (req, res, next) => {
    try {
        const user = req.user
        const userid = user.id

        const { name, bio } = req.body

        if (!name && !bio)
            return next(new Errorhandler("One edit in Profile is required", 400))

        const file = req.file ? req.file : null

        if (!user)
            return next(new Errorhandler("User not like_found", 400))

        if (user && !user.is_sign_up)
            return next(new Errorhandler("User is not Authenticated", 400))

        let displaypic = ""
        if (file) {
            displaypic = file.filename
        }

        const edit_user = await User.findByIdAndUpdate(userid, {
            name,
            bio,
            displaypic
        })

        return res.status(201).json({ msg: "Profile Edited Successfully", success: true })
    }
    catch (err) {
        return next(new Errorhandler(err))
    }
}

const followUser = async (req, res, next) => {
    try {
        const user = req.user
        const userid = user.id

        const { to_follow } = req.body

        if (!user)
            return next(new Errorhandler("User not like_found", 400))

        if (user && !user.is_sign_up)
            return next(new Errorhandler("User is not Authenticated", 400))

        if (!to_follow)
            return next(new Errorhandler("UserID of user to follow is not provided", 400))

        if (to_follow === userid)
            return next(new Errorhandler("User can't follow himself", 400))

        let followed = false
        const user_found = await User.find({ _id: userid, following: to_follow })

        if (user_found.length > 0)
            followed = true;

        if (followed) {
            await User.findByIdAndUpdate(userid, {
                $pull: {
                    following: to_follow
                }
            })

            await User.findByIdAndUpdate(to_follow, {
                $pull: {
                    followers: userid
                }
            })
        }

        else {
            await User.findByIdAndUpdate(userid, {
                $addToSet: {
                    following: to_follow
                }
            })

            await User.findByIdAndUpdate(to_follow, {
                $addToSet: {
                    followers: userid
                }
            })
        }

        if (followed)
            return res.status(201).json({ success: false, msg: "User unfollowed" })
        else
            return res.status(201).json({ success: true, msg: "User followed" })
    }
    catch (err) {
        return next(new Errorhandler(err))
    }
}

module.exports = {
    viewProfile,
    editProfile,
    followUser
}