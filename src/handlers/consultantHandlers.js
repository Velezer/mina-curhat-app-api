const Consultant = require("../models/Consultant")
const bcrypt = require('bcrypt')

exports.register = async (req, res) => {

    const { name, password } = req.body

    bcrypt.hash(password, 10, async (err, hash) => {
        let consultant = new Consultant({ name, password: hash })

        try {
            consultant = await consultant.save()
        } catch (err) {
            res.status(400).json({ errors: err })
        }

        res.status(201).json({
            message: `User ${consultant.name} created`
        })
    });

}


