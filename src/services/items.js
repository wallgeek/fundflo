const DB = require("../utils/db")
const EnterpriseService = require("./enterprises")
const { GeneralError } = require("../errors/custom")
const ErrorMessages = require("../errors/messages")
const StatusCodes = require("../utils/status-codes")

module.exports.find = async function(name, enterpriseId) {
    const result = await DB.query(`
        SELECT *
        FROM items
        WHERE name = $1 AND enterprise_id = $2
    `, [name, enterpriseId])

    return result.rows[0]
}

module.exports.add = async function(name, enterpriseName, unitAmount) {
    const enterprise = await EnterpriseService.find(enterpriseName)

    if(!enterprise) throw new GeneralError(ErrorMessages.ENTERPRISE_NOT_FOUND, StatusCodes.NOT_FOUND)

    const item = await this.find(name, enterprise.id)

    if(item) throw new GeneralError(ErrorMessages.ITEM_ALREADY_EXIST, StatusCodes.CONFLICT)

    return await DB.query(`
        INSERT into items
        (name, enterprise_id, unit_amount)
        VALUES
        ($1, $2, $3)
    `, [name, enterprise.id, unitAmount])
}