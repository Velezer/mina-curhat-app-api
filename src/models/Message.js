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
        consultant: {
            type: Schema.Types.ObjectId,
            required: [true, 'consultant required'],
            ref: 'Consultant'
        },
        message: {
            type: String,
            required: [true, 'message required']
        }
        // to_user: {
        //     type: Schema.Types.ObjectId,
        //     required: [true, 'to_user required']
        // },
    },
))



module.exports = Message