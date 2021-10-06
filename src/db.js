const mongoose = require("mongoose")

require("dotenv").config()

let DB_URI = process.env.DB_URI

if (process.env.ENVIRONTMENT === 'test') {
    DB_URI = process.env.DB_URI_TEST
}

function dbConnect() {
    mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch(err => console.error(err))
    return mongoose.connection
    
}

function dbClose() {
    return mongoose.disconnect()
}

const Chatroom = require("./models/Chatroom")
const Consultant = require("./models/Consultant")
const Message = require("./models/Message")
const Anonym = require("./models/Anonym")
module.exports = { dbConnect, dbClose, Chatroom, Consultant, Message, Anonym }