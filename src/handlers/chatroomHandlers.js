
exports.createChatroom = async (req, res, next) => {
    const { name, consultant, anonym } = req.body

    const { Chatroom } = req.db
    const chatroom = new Chatroom({ name, consultant, anonym })
    await chatroom.save()
        .then(() => {
            res.status(201).json({
                message: `chatroom ${name} created`,
                chatroom
            })
        })
        .catch(err => next(err))
}

exports.getChatrooms = async (req, res) => {
    const { consultant, anonym } = req.body

    const { Chatroom } = req.db
    const chatrooms = await Chatroom.find({ consultant, anonym })

    res.status(200).json({
        message: `getChatrooms`,
        chatrooms
    })
}

exports.getChatroomsById = async (req, res) => {
    const { _id } = req.body

    const { Chatroom } = req.db
    const chatrooms = await Chatroom.findOne({ _id })

    res.status(200).json({
        message: `getChatroomsById`,
        chatrooms
    })
}