const express = require("express")
const errorsMiddleware = require("./middleware/errors")
app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(errorsMiddleware.validationError);

app.use('/consultant', require("./routes/consultant"))
app.use('/chatroom', require("./routes/chatroom"))

app.use(errorsMiddleware.commonError);

module.exports = app