const { Errorhandler} = require("../middleware/errorHandler")
const createTweet = async (req, res, next) =>{
    try{

    }
    catch(err){
        return next(new Error)
    }
}