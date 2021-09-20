const jwt = require("jwt-then")
require("dotenv").config()


exports.login = async (req, res, next) => {
    const { name, password } = req.body

    const consultant = await Consultant.findOne({ name })
    if (consultant === null) {
        const err = new Error(`user ${consultant.name} not found`)
        err.code = 404
        next(err)
    }

    const match = await bcrypt.compare(password, consultant.password)

    if (!match) {
        const err = new Error(`password doesn't match`)
        err.code = 400
        next(err)
    }
    const token = await jwt.sign({ name: consultant.name, password: consultant.password }, process.env.JWT_KEY)

    res.status(200).json({
        message: `User ${consultant.name} logged in`,
        token: token
    })
}

