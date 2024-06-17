const DB = require("../utils/db")
const { GeneralError } = require("../errors/custom")
const ErrorMessages = require("../errors/messages")
const StatusCodes = require("../utils/status-codes")
const UserService = require("./users")
const EnterpriseService = require("./enterprises")

module.exports.add = async function(name, minOrderValue, enterpriseName, isFinal = false) {
    const user = await UserService.find(name)

    if(!user) throw new GeneralError(ErrorMessages.USER_NOT_FOUND, StatusCodes.NOT_FOUND)

    const enterprise = await EnterpriseService.find(enterpriseName)

    if(!enterprise) throw new GeneralError(ErrorMessages.ENTERPRISE_NOT_FOUND, StatusCodes.NOT_FOUND)
    
    return await DB.query(`
        INSERT into moderators
        (user_id, min_order_value, enterprise_id, is_active, is_final)
        VALUES
        ($1, $2, $3, $4, $5)
    `, [user.id, minOrderValue, enterprise.id, true, isFinal])
}