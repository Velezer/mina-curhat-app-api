const db = require("./db")
const createServer = require("./ioServer")


const server = createServer(db)

// eslint-disable-next-line no-undef
const port = process.env.PORT || 3001
server.listen(port, () => {
    console.log(`server listening on port ${port}`)
})