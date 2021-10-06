const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Message = mongoose.model('Message', new Schema(
    {
        chatroom: {
            type: Schema.Types.ObjectId,
            required: [true, 'chatroom is required'],
            ref: 'Chatroom'
        },
        sender_model: {
            type: String,
            enum: ['Consultant', 'Anonym'],
            required: [true, 'sender_model required'],
        },
        sender: {
            type: String,
            required: [true, 'sender required'],
            refPath: 'sender_model'
        },
        message: {
            type: String,
            required: [true, 'message required']
        }
    },
))



module.exports = Message