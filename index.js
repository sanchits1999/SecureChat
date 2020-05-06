require("./src/db/mongoose")
require("./src/model/user")
require("./src/model/message")
require("./src/model/user-message")
const express = require("express")
const auth_route = require("./src/routes/authRoutes")
const message_route = require("./src/routes/messageRoutes")
const app = express()

app.use(express.json())
app.use(auth_route)
app.use(message_route)

app.listen(3000,()=>{
    console.log("listening on port 3000")
})