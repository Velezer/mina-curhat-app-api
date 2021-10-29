require("dotenv").config()

exports.register = async (req, res, next) => {

    const { name, password, gender, role } = req.body

    const { Consultant } = req.db
    const found = await Consultant.findOne({ name })
    if (found) {
        const err = new Error(`user ${name} already exist`)
        err.code = 409
        return next(err)
    }
    const bcrypt = req.bcrypt
    const hashed = await bcrypt.hash(password, Number(process.env.SALT_OR_ROUNDS))

    let newConsultant = new Consultant({ name, password: hashed, gender, role })

    newConsultant = await newConsultant.save()
    res.status(201).json({
        message: `Consultant ${newConsultant.name} created`
    })
}

exports.login = async (req, res, next) => {
    const { name, password } = req.body

    const { Consultant } = req.db
    const found = await Consultant.findOne({ name }).select('+password')
    if (found === null) {
        const err = new Error(`user ${name} not found`)
        err.code = 404
        return next(err)
    }

    const bcrypt = req.bcrypt
    const match = await bcrypt.compare(password, found.password)

    if (!match) {
        const err = new Error(`password doesn't match`)
        err.code = 400
        return next(err)
    }

    const jwt = req.jwt
    const token = await jwt.sign({ _id: found._id, name, gender, role, model: 'Consultant' }, process.env.JWT_KEY, {
        expiresIn: `7d`
    })

    res.status(200).json({
        message: `User ${name} logged in`,
        data: { token }
    })
}

exports.getConsultants = async (req, res) => {

    const { Consultant } = req.db
    const consultants = await Consultant.find({})

    res.status(200).json({
        message: `get all consultants`,
        data: consultants
    })
}

exports.deleteConsultant = async (req, res) => {
    const { _id } = req.payload

    const { Consultant } = req.db
    const found = await Consultant.findOne({ _id })
    if (!found) {
        const err = new Error(`consultant not found`)
        err.code = 404
        return next(err)
    }
    res.status(200).json({
        message: `consultant deleted`,
    })
}


