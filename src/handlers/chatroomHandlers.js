const Chatroom = require("../models/Chatroom")

exports.createChatroom = async (req, res, next) => {
    const { name } = req.body

    const chatroom = new Chatroom({ name })
    await chatroom.save()
        .then(() => {
            res.status(201).json({
                message: `chatroom ${name} created`
            })
        })
        .catch(err => next(err))


}