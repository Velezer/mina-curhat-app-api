const jwt = require("jwt-then")
require("dotenv").config()


module.exports = async (socket, next) => {
    const token = socket.handshake.auth.token
    // eslint-disable-next-line no-undef
    await jwt.verify(token, process.env.JWT_KEY)
        .then((payload) => {
            socket.payload = payload;
            next()
        })
        .catch(err => {
            err.code = err.code || 400
            next(err)
        })

}