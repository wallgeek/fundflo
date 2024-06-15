const Express = require("express")
const OrderRouter = require("./routes/orders")
const ErrorHandle = require("./errors/handle")
const RequestLogger = require("./logger/request")
const App = Express()

App
.use(Express.json())
.use(RequestLogger)
.use("/v1/orders", OrderRouter)
.use(ErrorHandle)

module.exports = App
