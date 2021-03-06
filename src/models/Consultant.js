const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Consultant = mongoose.model('Consultant', new Schema(
    {
        name: {
            type: String,
            required: [true, 'name is required'],
            unique: [true, 'name is aready exist'],
        },
        password: {
            type: String,
            select: false,
            required: [true, 'password is required']
        },
        role: {
            type: String,
            enum: ['consultant', 'ustadz'],
            default: 'consultant',
            required: [true, 'role is required'],
        },
        gender: {
            type: String,
            enum: ['male', 'female'],
            required: [true, 'gender is required'],
        }

    },
))


module.exports = Consultant