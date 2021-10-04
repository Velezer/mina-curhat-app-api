const jwt = require("jwt-then")
require("dotenv").config()


module.exports = async (socket, next) => {
    const token = socket.handshake.auth.token
    // eslint-disable-next-line no-undef
    await jwt.verify(token, process.env.JWT_KEY)
        .then((payload) => {
            socket.payload = payload
            socket.emit(`connected`, `connected as ${payload.role}`)
            next()
        })
        .catch(err => {
            err.data = err.data || { code: 401 }
            next(err)
        })

}