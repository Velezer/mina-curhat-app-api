const express = require("express")
const errorsMiddleware = require("./middleware/errors")
const rules = require("./validator/rules")
app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/*', rules.jwt, require("./middleware/jwt").verify)

app.use('/jwt', require("./routes/jwt"))



app.use('/api/consultant', require("./routes/consultant"))
app.use('/api/chatroom', require("./routes/chatroom"))

app.use(errorsMiddleware.commonError);

module.exports = app