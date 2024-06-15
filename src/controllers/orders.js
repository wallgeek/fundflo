const Joi = require("joi")
const StatusCodes = require("../utils/status-codes")
const { ValidationError } = require("../errors/custom")
const OrderService = require("../services/orders")

module.exports.createOrder = async function(req, res, next) {
    const schema = Joi.object({
        item: Joi.string().required(),
        quantity: Joi.number().min(1).required()
    })

    const { value, error } = schema.validate(req.body)

    try {
        if(error) throw new ValidationError(error)

        await OrderService.order(req.user.id, value.item, value.quantity)

        return res.sendStatus(StatusCodes.CREATED)
    } catch (err) {
        next(err)
    }
}