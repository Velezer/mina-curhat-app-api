
const jwt = require("jwt-then")


exports.login = async (req, res) => {
    const { anonym } = req.body
    // eslint-disable-next-line no-undef
    const token = await jwt.sign({ anonym }, process.env.JWT_KEY)

    res.status(200).json({
        token: token
    })
}
