const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Message = mongoose.model('Message', new Schema(
    {
        chatroom: {
            type: Schema.Types.ObjectId,
            required: [true, 'chatroom is required'],
            unique: [true, 'chatroom is aready exist'],
            ref: 'Chatroom'
        },
        sender: {
            type: String,
            required: [true, 'sender required'],
        },
        message: {
            type: String,
            required: [true, 'message required']
        }
    },
))



module.exports = Message