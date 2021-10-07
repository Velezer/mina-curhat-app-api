const Message = require("./models/Message")
const createApp = require("./app")

module.exports = (db, bcrypt, jwt) => {
    const app = createApp(db, bcrypt, jwt)

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

    io.on("connection", async socket => {
        socket.on("joinRoom", async ({ chatroomId }) => {
            const found = await socket.db.Chatroom.findOne({ _id: chatroomId })
            if (!found) {
                return socket.emit('joinRoomFailed', 'chatroom not found')
            }

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
                sender: socket.payload._id, // socket.payload is from auth middleware
                sender_model: socket.payload.model,
                message,
            })
            socket.to(chatroomId).emit("newMessage", {
                sender: socket.payload._id,
                sender_model: socket.payload.model,
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
