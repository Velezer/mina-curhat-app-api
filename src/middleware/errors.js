
exports.mongooseError = (err, req, res, next) => {
    if (err.name != 'MongoServerError') return next(err)

    if (err.code == 11000) {
        err.code = 409
        err.message = 'duplicate key error'
        return next(err)
    }
}

exports.expressError = (err, req, res, next) => {
    if (process.env.NODE == 'production') {
        console.error(err.stack);
    }
    err.code = err.code || 500

    res.status(err.code).json({ message: err.message })
}

