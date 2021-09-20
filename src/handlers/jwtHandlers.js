const jwt = require("jwt-then")
// require("dotenv").config()

exports.verify = async (req, res) => {
    const { token } = req.body

    const result = await jwt.verify(token, process.env.JWT_KEY)

    res.status(200).json({
        message: `User ${consultant.name} logged in`,
        result: result
    })
}