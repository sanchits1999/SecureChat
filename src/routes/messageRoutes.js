const express = require("express")
const mongoose = require("mongoose")
const auth = require("../middleware/auth")
const UserMessage = mongoose.model("UserMessage")
const Message = mongoose.model("Messages")
const User = mongoose.model("User")
const router = express.Router()

router.use(auth)

router.get("/messages", (req, res) => {
    const response = []
    UserMessage.findOne({ u_id: new mongoose.Types.ObjectId(req.user._id) }).then((m) => {
        const m_id = m.messages

        if (m_id.length === 0) {
            return res.send({
                messages: response,
                error: false
            })
        }

        var loop1 = new Promise((resolve, reject) => {
            m_id.forEach((element, index) => {
                Message.findById(element.m_id).then((message) => {
                    console.log(message)
                    response.push(message)
                    if (index === m_id.length - 1) {
                        resolve()
                    }
                }).catch((e) => {
                    reject()
                })

            })
        })


        loop1.then(() => {

            res.send({
                messages: response,
                error: false
            })


        }).catch(() => {
            res.send({
                message: "Unknown error encountered",
                error: true
            })
        })

    }).catch((e) => {
        res.send({
            message: "Unknown error encountered",
            error: true
        })
    })
})

router.get("/users", (req, res) => {

    const users = []

    User.find({}).then((response) => {
        response.forEach((user) => {
            const u = {
                id: user._id,
                uname: user.UserName
            }
            users.push(u)
        })

        res.send({
            users: users,
            error: false
        })

    }).catch((e) => {
        res.send({
            message: "Unknown error encountered",
            error: true
        })
    })
})

router.post("/sendMessage", (req, res) => {
    const message = new Message({
        message: req.body.message,
        sender: {
            senderId: req.user._id,
            UserName: req.user.UserName
        }
    })
    message.save().then((m) => {

        if (req.body.taged.length === 0) {
            User.find({}).then((response) => {
                var loop = new Promise((resolve, reject) => {
                    response.forEach((user, index) => {
                        UserMessage.findOne({ u_id: mongoose.Types.ObjectId(user._id) }).then((response) => {
                            response.messages.push({ m_id: m._id })
                            response.save().then(() => {

                            }).catch(() => {
                                return res.send({
                                    message: "Unknown error encountered",
                                    error: true
                                })
                            })
                        })
                        if (index === response.length - 1) {
                            resolve()
                        }
                    })
                })

                loop.then(() => {
                    res.send({
                        message: "Sent",
                        error: false
                    })
                }).catch(() => {

                })

            }).catch((e) => {
                return res.send({
                    message: "Unknown error encountered",
                    error: true
                })
            })

            return null
        }
        req.body.taged.push(req.user._id)

        req.body.taged.forEach((id) => {
            console.log(id)
            UserMessage.findOne({ u_id: new mongoose.Types.ObjectId(id) }).then((um) => {
                um.messages.push({ m_id: m._id })
                um.save().then(() => {
                    console.log("saved")
                }).catch((e) => {
                    console.log(e)
                    return res.send({
                        message: "Unknown error encountered",
                        error: true
                    })
                })
            }).catch((e) => {
                console.log(e)
                res.send({
                    message: "Unknown error encountered",
                    error: true
                })
            })
        })

        res.send({
            message: "sent",
            error: false
        })

    }).catch((e) => {
        console.log(e)
        res.send({
            message: "Unknown error encountered",
            error: true
        })
    })
})

module.exports = router