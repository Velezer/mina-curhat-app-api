const jwt = require("jwt-then")
require("dotenv").config()

exports.verify = async (req, res, next) => {
    const { token } = req.body

    await jwt.verify(token, process.env.JWT_KEY)
        .then(() => next())
        .catch(err => res.status(401).json({ errors: err }))

}