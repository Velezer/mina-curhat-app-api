

// eslint-disable-next-line no-unused-vars
exports.commonError = (err, req, res, next) => {
    console.error(err.stack);
    err.code = err.code || 500

    res.status(err.code).json({ message: err.message })
}