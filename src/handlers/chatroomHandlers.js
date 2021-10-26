
exports.createChatroom = async (req, res, next) => {
    if (req.payload.role !== 'anonym') {
        const err = new Error('only anonym can create chatroom')
        err.code = 400
        return next(err)
    }

    const { consultant, chatroom_token } = req.body
    const { Chatroom } = req.db
    const chatroom = new Chatroom({ consultant, chatroom_token, anonym: req.payload._id })
    await chatroom.save()
        .then(() => {
            res.status(201).json({
                message: `chatroom ${chatroom_token} created`,
                data: chatroom
            })
        })
        .catch(err => {
            next(err)
        })
}

exports.getChatrooms = async (req, res) => {
    const { _id, role } = req.payload

    const { Chatroom } = req.db

    let chatrooms = null

    if (role === 'anonym') {
        chatrooms = await Chatroom.find({ anonym: _id })
    } else if (role === 'consultant' || role === 'ustadz') {
        chatrooms = await Chatroom.find({ consultant: _id })
    }

    res.status(200).json({
        message: `getChatrooms`,
        data: chatrooms
    })
}

exports.getChatroomsById = async (req, res) => {
    const { _id } = req.params

    const { Chatroom } = req.db
    const found = await Chatroom.findOne({ _id })
    if (!found) {
        const err = new Error(`chatroom not found`)
        err.code = 404
        return next(err)
    }
    res.status(200).json({
        message: `getChatroomsById`,
        data: found
    })
}