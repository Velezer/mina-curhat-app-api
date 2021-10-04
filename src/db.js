const mongoose = require("mongoose")

require("dotenv").config()

if (process.env.NODE == 'production') {
    mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(async () => {
            console.log(`connected db`)
        })
        .catch(err => console.error(err))
}


const Chatroom = require("./models/Chatroom")
const Consultant = require("./models/Consultant")
const Message = require("./models/Message")
module.exports = { Chatroom, Consultant, Message }