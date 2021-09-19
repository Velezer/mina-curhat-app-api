const Consultant = require("../models/Consultant")

exports.register = async (req, res) => {
    const { name, password } = req.body

    const consultant = new Consultant({ name, password })
    await consultant.save()


    res.status(201).json({
        message: `User ${name} created`
    })

}
exports.login = async (req, res) => {

    const { name, password } = req.body

    const consultant = await Consultant.findOne({ name, password })

    res.status(200).json({
        message: `User ${name} logged in`
    })

}