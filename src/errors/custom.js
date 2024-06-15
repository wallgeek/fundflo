class ValidationError extends Error {
    constructor(message){
        super(message)

        this.statusCode = 400

        Error.captureStackTrace(this, this.constructor)
    }
}

class GeneralError extends Error {
    constructor(message, statusCode){
        super(message)

        this.statusCode = statusCode

        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = {
    ValidationError,
    GeneralError
}