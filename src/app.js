const express = require("express")
const errorsMiddleware = require("./middleware/errors")
const cors = require('cors');

const app = express()

app.use(cors({ credentials: true, origin: '*' }));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))




app.use('/api/consultants', require("./routes/consultant"))
app.use('/api/chatroom', require("./routes/chatroom"))
app.use('/api/anonym', require("./routes/anonym"))

app.use(errorsMiddleware.expressError);

module.exports = app