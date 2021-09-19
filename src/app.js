const express = require("express")

app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/consultant', require("./routes/consultant"))


module.exports = app