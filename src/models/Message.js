const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Message = mongoose.model('Message', new Schema(
    {
        chatroom: {
            type: Schema.Types.ObjectId,
            required: [true, 'chatroom is required'],
            ref: 'Chatroom'
        },
        sender: {
            type: String,
            required: [true, 'sender required'],
        },
        role: {
            type: String,
            required: [true, 'role required'],
        },
        message: {
            type: String,
            required: [true, 'message required']
        }
    },
))



module.exports = Message