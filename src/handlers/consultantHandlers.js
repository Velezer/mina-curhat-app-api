const Consultant = require("../models/Consultant")
const bcrypt = require('bcrypt')
const jwt = require("jwt-then")
require("dotenv").config()

exports.register = async (req, res, next) => {

    const { name, password } = req.body

    const consultant = await Consultant.findOne({ name })
    if (consultant.name === name) {
        const err = new Error(`user ${consultant.name} already exist`)
        err.code = 409
        next(err)
    }
    // eslint-disable-next-line no-undef
    bcrypt.hash(password, Number(process.env.SALT_OR_ROUNDS), async (err, hash) => {
        if (err) next(err)
        let consultant = new Consultant({ name, password: hash })

        await consultant.save()
            .then(() => {
                res.status(201).json({
                    message: `User ${consultant.name} created`
                })
            })
            .catch(err => next(err))

    })

}

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
    // eslint-disable-next-line no-undef
    const token = await jwt.sign({ name, role: 'consultant' }, process.env.JWT_KEY)

    res.status(200).json({
        message: `User ${consultant.name} logged in`,
        token: token
    })
}

exports.getConsultants = async (req, res) => {

    const consultants = await Consultant.find({})

    res.status(200).json({
        message: `get all consultants`,
        consultants
    })
}


