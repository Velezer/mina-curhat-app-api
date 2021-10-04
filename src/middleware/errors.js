

// eslint-disable-next-line no-unused-vars
exports.expressError = (err, req, res, next) => {
    if (process.env.NODE == 'production') {
        console.error(err.stack);
    }
    err.code = err.code || 500

    res.status(err.code).json({ message: err.message })
}
// eslint-disable-next-line no-unused-vars