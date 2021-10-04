
exports.createChatroom = async (req, res, next) => {
    if (req.payload.role !== 'anonym') {
        const err = new Error('only anonym can create chatroom')
        err.code = 400
        return next(err)
    }

    const { name, consultant, token_chatroom } = req.body
    const { Chatroom } = req.db
    const chatroom = new Chatroom({ name, consultant, token_chatroom, anonym: req.payload.name })
    await chatroom.save()
        .then(() => {
            res.status(201).json({
                message: `chatroom ${name} created`,
                data: chatroom
            })
        })
        .catch(err => next(err))
}

exports.getChatrooms = async (req, res) => {
    const { name, role } = req.payload

    const { Chatroom } = req.db

    let chatrooms = null

    if (role === 'anonym') {
        chatrooms = await Chatroom.find({ anonym: name })
    } else if (role === 'consultant' || role === 'ustadz') {
        chatrooms = await Chatroom.find({ consultant: name })
    }

    res.status(200).json({
        message: `getChatrooms`,
        data: chatrooms
    })
}

exports.getChatroomsById = async (req, res) => {
    const { _id } = req.params

    const { Chatroom } = req.db
    const chatrooms = await Chatroom.findOne({ _id })

    res.status(200).json({
        message: `getChatroomsById`,
        data: chatrooms
    })
}