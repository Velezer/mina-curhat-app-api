const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Chatroom = mongoose.model('Chatroom', new Schema(
    {
        consultant: {
            type: Schema.Types.ObjectId,
            required: [true, 'consultant required'],
            ref: 'Consultant'
        },
        anonym: {
            type: Schema.Types.ObjectId,
            required: [true, 'anonym required'],
            ref: 'Anonym'
        },
        chatroom_token: {
            type: String,
            required: [true, 'chatroom_token required'],
            unique: [true, 'chatroom_token must be unique'],
        },

    },
))



module.exports = Chatroom