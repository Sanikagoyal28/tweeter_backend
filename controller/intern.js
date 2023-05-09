// const User = require("../models/userModel")
// const Errorhandler = require("../middleware/errorHandler")

// const update_name = async(req, res, next)=>{
//     try{

//         const {name, email} = req.body;

//         const find_user = await User.findOne({email: email.toLowerCase()})

//         if(!find_user)
//         return next(new Errorhandler("User not found by this email", 400))

//         await User.findOneAndUpdate({email: email.toLowerCase()}, {
//             name:name
//         })

//         return res.status(201).json({msg:"Your name is updated"})

//     }
//     catch(err){
//         return next(new Errorhandler(err))
//     }
// }