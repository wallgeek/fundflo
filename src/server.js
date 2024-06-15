const App = require("./app")
const DB = require("./utils/db")
const PORT = 3000

DB
.connect()
.then(() => App
.listen(PORT, function(){
    console.log(`Server is running at port ${PORT}`)
}))
.catch(console.error)
