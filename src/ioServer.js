const Message = require("./models/Message")
const createApp = require("./app")

module.exports = (db, bcrypt, jwt) => {
    const app = createApp(db, bcrypt)

    const httpServer = require("http").createServer(app)
    const io = require("socket.io")(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true
        },
        allowEIO3: true // false by default
    })

    io.use((socket, next) => {
        socket.db = db
        socket.bcrypt = bcrypt
        socket.jwt = jwt
        next()
    })

    const auth = require("./middleware/auth-io")
    io.use(auth) // assign value of payload to socket.payload on success

    io.on("connection", socket => {
        socket.on("joinRoom", ({ chatroomId }) => {
            socket.join(chatroomId)
            socket.emit('joinedRoom', chatroomId)
        })

        socket.on("leaveRoom", ({ chatroomId }) => {
            socket.leave(chatroomId)
            socket.emit('leftRoom', chatroomId)
        })

        socket.on("sendMessage", async ({ chatroomId, message }) => {
            const newMessage = new socket.db.Message({
                chatroom: chatroomId,
                sender: socket.payload.name,
                role: socket.payload.role,
                message,
            })

            socket.to(chatroomId).emit("newMessage", {
                sender: socket.payload.name,
                role: socket.payload.role,
                message,
            })

            await newMessage.save()
        })


        socket.on("disconnect", () => {
            if (process.env.NODE == 'production') {
                console.log(`${socket.payload.role} ${socket.payload.name} disconnected`)
            }
        })
    })

    return httpServer
}
