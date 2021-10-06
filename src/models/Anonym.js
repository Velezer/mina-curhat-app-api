const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Anonym = mongoose.model('Anonym', new Schema(
    {
        name: {
            type: String,
            required: [true, 'name is required'],
            unique: [true, 'name must be unique'],
        },
        role: {
            type: String,
            enum: ['anonym'],
            default: 'anonym',
            required: [true, 'role is required'],
        },
        gender: {
            type: String,
            enum: ['male', 'female'],
            required: [true, 'gender is required'],
        }

    },
))


module.exports = Anonym