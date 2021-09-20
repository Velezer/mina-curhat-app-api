const Consultant = require("../models/Consultant")
const bcrypt = require('bcrypt')
require("dotenv").config()
const jwt = require("jwt-then")

exports.register = async (req, res) => {
    const { name, password } = req.body


    bcrypt.hash(password, process.env.SALT, async (err, hash) => {
        let consultant = new Consultant({ name, password: hash })
        consultant = await consultant.save()

        res.status(201).json({
            message: `User ${consultant.name} created`
        })
    });

}


exports.login = async (req, res) => {
    const { name, password } = req.body

    const consultant = await Consultant.findOne({ name })
    if (consultant === null) {
        return res.status(404).json({
            message: `user ${consultant.name} not found`,
        })
    }

    const match = await bcrypt.compare(password, consultant.password)

    if (!match) {
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