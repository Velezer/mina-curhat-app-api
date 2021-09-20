require("./db")
const app = require("./app")
const httpServer = require("http").createServer(app);
// const io = require("socket.io")(httpServer, options);

// io.on("connection", socket => {
    
// });

const port = process.env.PORT || 3001
httpServer.listen(port, () => {
    console.log(`server listening on port ${port}`)
})