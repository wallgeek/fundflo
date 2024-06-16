const Express = require("express")
const Router = Express.Router()
const Auth = require("../middlewares/auth")
const Orders = require("../controllers/orders")

Router
.route("/")
.post(Auth, Orders.createOrder)

Router
.route("/:orderId")
.get(Auth, Orders.getOrder)

Router
.route("/:orderId/accept")
.post(Auth, Orders.acceptOrder)

Router
.route("/:orderId/reject")
.post(Auth, Orders.rejectOrder)

module.exports = Router