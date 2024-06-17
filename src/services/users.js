const DB = require("../utils/db")
const { GeneralError } = require("../errors/custom")
const ErrorMessages = require("../errors/messages")
const StatusCodes = require("../utils/status-codes")

module.exports.add = async function(name) {
    // find user with given name
    const user = await this.find(name)

    if(user) throw new GeneralError(ErrorMessages.USER_ALREADY_EXIST, StatusCodes.CONFLICT)

    return await DB.query(`
        INSERT into users
        (name)
        VALUES
        ($1)
        RETURNING id
    `, [name])
}

module.exports.find = async function(name) {
    const result = await DB.query(`
        SELECT *
        FROM users
        WHERE name = $1
    `, [name])

    return result.rows[0]
}