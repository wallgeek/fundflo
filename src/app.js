const Express = require("express")
const OrderRouter = require("./routes/orders")
const UserRouter = require("./routes/users")
const EnterpriseRouter = require("./routes/enterprises")
const ItemRouter = require("./routes/items")
const ModeratorRouter = require("./routes/moderators")
const ErrorHandle = require("./errors/handle")
const RequestLogger = require("./logger/request")
const App = Express()

App
.use(Express.json())
.use(RequestLogger)
.use("/v1/orders", OrderRouter)
.use("/admin/users", UserRouter)
.use("/admin/enterprises", EnterpriseRouter)
.use("/admin/items", ItemRouter)
.use("/admin/moderators", ModeratorRouter)
.use(ErrorHandle)

module.exports = App
