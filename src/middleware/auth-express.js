require("dotenv").config()

module.exports = async (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        const err = new Error(`no auth header`)
        err.code = 401
        return next(err)
    }
    const token = authorization.split('Bearer ')[1]

    const jwt = req.jwt
    await jwt.verify(token, process.env.JWT_KEY)
        .then((payload) => {
            req.payload = payload
            next()
        })
        .catch(err => {
            err.code = err.code || 401
            next(err)
        })

}