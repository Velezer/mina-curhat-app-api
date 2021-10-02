const express = require("express")
const errorsMiddleware = require("./middleware/errors")
const cors = require('cors');


module.exports = (db) => {

    const app = express()

    app.use(cors({ credentials: true, origin: '*' }));

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))


    app.use((req, res, next) => {
        req.db = db
        next()
    })


    app.use('/api/consultants', require("./routes/consultant"))
    app.use('/api/chatroom', require("./routes/chatroom"))
    app.use('/api/anonym', require("./routes/anonym"))

    app.use(errorsMiddleware.expressError);

    return app
}

