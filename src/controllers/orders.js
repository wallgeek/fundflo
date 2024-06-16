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

module.exports.acceptOrder = async function(req, res, next) {
    const {orderId} = req.params
    const userId = req.user.id

    try {
        const result = await OrderService.approve(userId, orderId)

        if(result) return res.sendStatus(StatusCodes.SUCCESS)
        else return res.sendStatus(StatusCodes.NO_CONTENT)
    }catch(err){
        next(err)
    }
}

module.exports.rejectOrder = async function(req, res, next) {
    const {orderId} = req.params
    const userId = req.user.id

    try {
        const result = await OrderService.reject(userId, orderId)

        if(result) return res.sendStatus(StatusCodes.SUCCESS)
        else return res.sendStatus(StatusCodes.NO_CONTENT)
    }catch(err){
        next(err)
    }
}

module.exports.getOrder = async function(req, res, next) {
    const {orderId} = req.params
    const userId = req.user.id

    try {
        const result = await OrderService.get(userId, parseInt(orderId))

        return res.json(result)
    }catch(err){
        next(err)
    }
}