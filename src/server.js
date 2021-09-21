require("./db")
const app = require("./app")
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    },
    allowEIO3: true // false by default
})

const auth = require("./middleware/auth-io")
io.use(auth) // pass payload to socket.payload on success

io.on("connection", socket => {
    console.log(socket.payload)

});

// eslint-disable-next-line no-undef
const port = process.env.PORT || 3001
httpServer.listen(port, () => {
    console.log(`server listening on port ${port}`)
})