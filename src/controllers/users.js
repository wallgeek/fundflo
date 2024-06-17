const Joi = require("joi")
const StatusCodes = require("../utils/status-codes")
const { ValidationError } = require("../errors/custom")
const UserService = require("../services/users")

module.exports.addUser = async function(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required()
    })

    const { value, error } = schema.validate(req.body)

    try {
        if(error) throw new ValidationError(error)

        await UserService.add(value.name)

        return res.sendStatus(StatusCodes.CREATED)
    } catch (err) {
        next(err)
    }
}
