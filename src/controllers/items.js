const Joi = require("joi")
const StatusCodes = require("../utils/status-codes")
const { ValidationError } = require("../errors/custom")
const ItemService = require("../services/items")

module.exports.addItem = async function(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        enterprise: Joi.string().required(),
        unitAmount: Joi.number().required().greater(0)
    })

    const { value, error } = schema.validate(req.body)

    try {
        if(error) throw new ValidationError(error)

        await ItemService.add(value.name, value.enterprise, value.unitAmount)

        return res.sendStatus(StatusCodes.CREATED)
    } catch (err) {
        next(err)
    }
}
