const User = require("../models/userModel")
const { Errorhandler } = require("../middleware/errorHandler")

const viewProfile = async (req, res, next) => {
    try {
        const user = req.user
        const { username } = req.query

        if (!user)
            return next(new Errorhandler("User not like_found", 400))

        if (user && !user.is_sign_up)
            return next(new Errorhandler("User is not Authenticated", 400))

        if (!username)
            return next(new Errorhandler("Username is not provided", 400))

        let profile;
        if (username === user.username) {
            profile = await User.findOneAndUpdate({ username }, {
                my_profile: true
            })
                .populate({
                    path: 'tweets liked',
                    populate: {
                        path: 'user_id'
                }
                }).populate('followers').populate('following')
        }
        else {
            profile = await User.findOneAndUpdate({ username }, { __v: 0 }, {
                my_profile: false
            })
                .populate({
                    path: 'tweets liked',
                    populate: {
                        path: 'user_id'
                }
                }).populate('followers').populate('following')
        }

        const likes = []
        const bookmarks = []

        for (var i = 0; i < profile.tweets.length; i++) {
            const like_found = await User.findOne({ username, liked: profile.tweets[i]._id })

            if (like_found) {
                likes.push(true)
            }
            else {
                likes.push(false)
            }

            const bm_found = await User.findOne({ username, bookmark: profile.tweets[i]._id })

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