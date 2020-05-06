const mongoose = require("mongoose")

const MessageSchema = new mongoose.Schema({
    message: {
        type: String,
        require: true
    },
    time: {
        type: Date,
        default: Date.now
    },
    sender: {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            require: true
        },
        UserName: {
            type: String,
            require: true
        }
    }
})

mongoose.model("Messages", MessageSchema)