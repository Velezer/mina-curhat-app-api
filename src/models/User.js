const mongoose = require('mongoose')

const Schema = mongoose.Schema

const User = mongoose.model('User', new Schema(
    {
        name: {
            type: String,
            required: [true, 'name is required'],
            unique: [true, 'name is aready exist'],
        },

    },
))



module.exports = User