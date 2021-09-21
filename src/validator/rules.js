const { body, validationResult } = require('express-validator');



const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next()
}

exports.consultant = [
    body(`name`, `name is empty`).notEmpty(),
    body(`password`, `password is empty`).notEmpty(),
    validate
]

exports.chatroom = [
    body(`name`, `name is empty`).notEmpty(),
    body(`consultant`, `consultant is empty`).notEmpty(),
    body(`anonym`, `anonym is empty`).notEmpty(),
    validate
]
