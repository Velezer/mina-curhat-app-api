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
            required: [true, 'password is required'],
        },
        role: {
            type: String,
            enum: ['consultant', 'ustadz'],
            default: 'consultant'
        }

    },
))


module.exports = Consultant