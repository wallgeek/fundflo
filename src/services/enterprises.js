const DB = require("../utils/db")
const { GeneralError } = require("../errors/custom")
const ErrorMessages = require("../errors/messages")
const StatusCodes = require("../utils/status-codes")

module.exports.add = async function(name) {
    const enterprise = await this.find(name)

    if(enterprise) throw new GeneralError(ErrorMessages.ENTERPRISE_ALREADY_EXISTS, StatusCodes.CONFLICT)

    return await DB.query(`
        INSERT into enterprises
        (name)
        VALUES
        ($1)
    `, [name])
}

module.exports.find = async function(name) {
    const result = await DB.query(`
        SELECT *
        FROM enterprises
        WHERE name = $1
    `, [name])

    return result.rows[0]
}