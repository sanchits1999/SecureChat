const mongoose = require("mongoose")

const UserMessageSchema = new mongoose.Schema({
    u_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique : true
    },
    messages: [
        {
            m_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Messages",
                required: true
            }
        }
    ]
})

mongoose.model("UserMessage", UserMessageSchema)