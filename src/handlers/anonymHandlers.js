
const jwt = require("jwt-then")


exports.login = async (req, res) => {
    // eslint-disable-next-line no-undef
    const token = await jwt.sign(req.body, process.env.JWT_KEY)

    res.status(200).json({
        token: token
    })
}
