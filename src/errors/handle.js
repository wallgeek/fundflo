require("dotenv").config()

const StatusCodes = require("../utils/status-codes")
const ErrorLogger = require("../logger/error")
const InfoLogger = require("../logger/info")
const NODE_ENV = process.env.NODE_ENV

module.exports = async function(err, req, res, next){
    if(err && (!err.statusCode || err.statusCode === StatusCodes.INTERNAL_SERVER_ERROR)){
        ErrorLogger(err.message)
    }
    
    const statusCode = err && err.statusCode ? err.statusCode : StatusCodes.INTERNAL_SERVER_ERROR
    
    if(NODE_ENV !== "production" && err && !err.message){
        res.sendStatus(statusCode)
    }else if(NODE_ENV !== "production"){
        res.status(statusCode).json({
            message: err.message,
            stack: err.stack
        })
    }else if (statusCode === StatusCodes.INTERNAL_SERVER_ERROR || (err && !err.message)) {
        res.sendStatus(statusCode)
    }else {
        res.status(statusCode).send(err.message)
    }
    
    InfoLogger(err.message)
}