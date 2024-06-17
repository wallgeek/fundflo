const Express = require("express")
const Router = Express.Router()
const Item = require("../controllers/items")

Router
.route("/add")
.post(Item.addItem)

module.exports = Router