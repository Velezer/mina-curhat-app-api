const Chatroom = require("../models/Chatroom")

exports.createChatroom = async (req, res) => {
    const { name } = req.body

    const chatroom = new Chatroom({ name })
    await chatroom.save()
    .then(() => {
        res.status(201).json({
            message: `chatroom ${name} created`
        })
    })
    .catch(err => {
        err.code = err.code || 500
    })

   
}