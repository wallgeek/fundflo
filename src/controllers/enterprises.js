const Joi = require("joi")
const StatusCodes = require("../utils/status-codes")
const { ValidationError } = require("../errors/custom")
const EnterpriseService = require("../services/enterprises")

module.exports.addEnterprise = async function(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required()
    })

    const { value, error } = schema.validate(req.body)

    try {
        if(error) throw new ValidationError(error)

        await EnterpriseService.add(value.name)

        return res.sendStatus(StatusCodes.CREATED)
    } catch (err) {
        next(err)
    }
}
