


exports.login = async (req, res, next) => {
    const { name, gender } = req.body

    const { Anonym } = req.db
    const found = await Anonym.findOne({ name, gender, role: 'anonym' })
    if (found) {
        const err = new Error('anonym name has already taken')
        err.code = 409
        return next(err)
    }
    let newAnonym = new Anonym({ name, gender, role: 'anonym' })
    newAnonym.save()
        .then(async (newAnonym) => {
            const jwt = req.jwt
            const token = await jwt.sign({ _id: newAnonym._id, name, gender, role: 'anonym', model: 'Anonym' }, process.env.JWT_KEY, {
                expiresIn: `7d`
            })

            res.status(200).json({
                message: `your anonym token can only be used within one week`,
                data: { token },
            })
        })
        .catch(err => next(err))


}
