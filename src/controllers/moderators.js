const Joi = require("joi")
const StatusCodes = require("../utils/status-codes")
const { ValidationError } = require("../errors/custom")
const ModeratorService = require("../services/moderators")

module.exports.addModerator = async function(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        minOrderValue: Joi.number().required().greater(0),
        enterprise: Joi.string().required(),
        isSupreme: Joi.boolean()
    })

    const { value, error } = schema.validate(req.body)

    try {
        if(error) throw new ValidationError(error)

        await ModeratorService.add(value.name, value.minOrderValue, value.enterprise, value.isSupreme)

        return res.sendStatus(StatusCodes.CREATED)
    } catch (err) {
        next(err)
    }
}
