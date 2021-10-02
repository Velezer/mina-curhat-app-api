const mongoose = require('mongoose')
require('dotenv').config()

// eslint-disable-next-line no-undef
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log(`connected db`)
    })
    .catch(err => console.error(err))


module.exports = { Chatroom, Consultant, Message }