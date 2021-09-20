const Consultant = require("../models/Consultant")
const bcrypt = require('bcrypt')

exports.register = async (req, res, next) => {

    const { name, password } = req.body

    bcrypt.hash(password, 10, async (err, hash) => {
        let consultant = new Consultant({ name, password: hash })

        await consultant.save()
            .then(() => {
                res.status(201).json({
                    message: `User ${consultant.name} created`
                })
            })
            .catc(err => {
                err.code = err.code || 500
                next(err)
            })

    });

}


