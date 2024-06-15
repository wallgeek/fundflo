const Express = require("express")
const Router = Express.Router()
const Auth = require("../middlewares/auth")
const Orders = require("../controllers/orders")

Router
.route("/")
.post(Auth, Orders.createOrder)

module.exports = Router