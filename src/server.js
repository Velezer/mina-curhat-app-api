require("./db")
const Message = require("./models/Message")
const app = require("./app")
const httpServer = require("http").createServer(app)
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
    console.log(`connected as ${socket.payload.role}`)

    socket.on("disconnect", () => {
        // socket.rooms.size === 0
        console.log(`${socket.payload.role} ${socket.payload.name} disconnected`)
    })

    socket.on("joinRoom", ({ chatroomId }) => {
        socket.join(chatroomId)
        console.log(`${socket.payload.role} ${socket.payload.name} joined ${chatroomId}`)
    })

    socket.on("leaveRoom", ({ chatroomId }) => {
        socket.leave(chatroomId)
        console.log(`${socket.payload.role} ${socket.payload.name} left ${chatroomId}`)
    })

    socket.on("sendMessage", async ({ chatroomId, message }) => {
        const newMessage = new Message({
            chatroom: chatroomId,
            sender: socket.payload.name,
            role: socket.payload.role,
            message,
        })

        io.to(chatroomId).emit("newMessage", {
            sender: socket.payload.name,
            role: socket.payload.role,
            message,
        })
        await newMessage.save()
    })
})

// eslint-disable-next-line no-undef
const port = process.env.PORT || 3001
httpServer.listen(port, () => {
    console.log(`server listening on port ${port}`)
})