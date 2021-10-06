


exports.login = async (req, res) => {
    const { name, gender } = req.body

    const { Anonym } = req.db
    let newAnonym = new Anonym({ name, gender, role: 'anonym' })
    newAnonym = await newAnonym.save()

    const jwt = req.jwt
    const token = await jwt.sign({ name, gender, role: 'anonym' }, process.env.JWT_KEY)

    res.status(200).json({
        message: `your anonym token can only be used within one week`,
        token: token
    })
}
