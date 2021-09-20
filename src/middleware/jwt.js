const jwt = require("jwt-then")
require("dotenv").config()

exports.verify = async (req, res, next) => {
    const { token } = req.body

    await jwt.verify(token, process.env.JWT_KEY)
        .then(() => next())
        .catch(err => {
            err.code = err.code || 401
            next(err)
        })

}