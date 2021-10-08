const db = require("./db")
const bcrypt = require("bcrypt")
const jwt = require("jwt-then")

const createServer = require("./ioServer")

db.dbConnect()
const server = createServer(db, bcrypt, jwt)

// eslint-disable-next-line no-undef
const port = process.env.PORT || 3001
server.listen(port, () => {
    console.log(`server listening on port ${port}`)
})