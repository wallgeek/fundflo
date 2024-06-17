const Express = require("express")
const Router = Express.Router()
const Enterprise = require("../controllers/enterprises")

Router
.route("/add")
.post(Enterprise.addEnterprise)

module.exports = Router