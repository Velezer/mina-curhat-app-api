const Chatroom = require("../models/Chatroom")

exports.createChatroom = async (req, res, next) => {
    const { name, consultant, anonym } = req.body

    const chatroom = new Chatroom({ name, consultant, anonym })
    await chatroom.save()
        .then(() => {
            res.status(201).json({
                message: `chatroom ${name} created`
            })
        })
        .catch(err => next(err))


}