const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Chatroom = mongoose.model('Chatroom', new Schema(
    {
        name: {
            type: String,
            required: [true, 'name is required'],
            unique: [true, 'name is aready exist'],
        },
        consultant: {
            type: Schema.Types.ObjectId,
            required: [true, 'consultant required'],
            ref: 'Consultant'

        },
        anonym: {
            type: String,
            required: [true, 'anonym required']
        },

    },
))



module.exports = Chatroom