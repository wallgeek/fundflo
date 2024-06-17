const Express = require("express")
const Router = Express.Router()
const Users = require("../controllers/users")

Router
.route("/add")
.post(Users.addUser)

module.exports = Router