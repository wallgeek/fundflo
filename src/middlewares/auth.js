const DB = require("../utils/db")
const StatusCodes = require("../utils/status-codes")
const { GeneralError } = require("../errors/custom")

module.exports = async function(req, res, next){
    const authHeader = req.headers["authorization"]

    if(!authHeader) return next(new GeneralError("", StatusCodes.UNAUTHORIZED))

    const data = await DB.query(`select id from users where name = $1`, [authHeader])

    if(data.rows.length === 0) return next(new GeneralError("", StatusCodes.UNAUTHORIZED))
    
    req.user = {id: data.rows[0].id}

    return next()
}