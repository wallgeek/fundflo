const Express = require("express")
const Router = Express.Router()
const Moderator = require("../controllers/moderators")

Router
.route("/add")
.post(Moderator.addModerator)

module.exports = Router