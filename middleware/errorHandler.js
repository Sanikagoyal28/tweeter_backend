
class Errorhandler extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
    }
}
// custom error having more than one parameter since it is a extended class of Error called using Errorhandler
const errorHandler = (err, req, res, next) => {
    console.log(err)
    const errStatus = err.statusCode || 500
    const errMsg = err.message || "Something went wrong"

    res.status(errStatus).json({
        message: err.message,
        success: false,
        statusCode: errStatus,
        // stack: err.stack
    })
}


// custom message error : calling by class name Error (19 in authController) 
// const errorHandler = (err, req, res, next) => {
// const errStatus = err.statusCode || 500
//     const errMsg = err.message || "Something went wrong"

//     res.status(404).json({
//         message: err.message,
//     })
// }

module.exports = {errorHandler, Errorhandler }