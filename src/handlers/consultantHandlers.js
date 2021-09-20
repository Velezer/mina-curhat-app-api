const Consultant = require("../models/Consultant")

exports.register = async (req, res) => {
    const { name, password } = req.body

    const consultant = new Consultant({ name, password })
    await consultant.save()


    res.status(201).json({
        message: `User ${name} created`
    })

}

const jwt = require("jwt-then")
// require("dotenv").config()

exports.login = async (req, res) => {
    const { name, password } = req.body

    const consultant = await Consultant.findOne({ name })
    if (consultant === null) {
        return res.status(404).json({
            message: `user ${consultant.name} not found`,
        })
    }
    if (consultant.password !== password) {
        return res.status(400).json({
            message: `password doesn't match`,
        })
    }
    const token = await jwt.sign({ name: consultant.name, password: consultant.password }, process.env.JWT_KEY)

    res.status(200).json({
        message: `User ${consultant.name} logged in`,
        token: token
    })

}