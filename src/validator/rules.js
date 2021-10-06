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
    body(`gender`, `gender must be male or female`)
        .notEmpty().bail()
        .isIn(['male', 'female']).bail(),
    body(`role`, `gender must be consultant or ustadz`)
        .notEmpty().bail()
        .isIn(['consultant', 'ustadz']).bail(),
    validate
]

exports.anonym = [
    body(`name`, `name is empty`).notEmpty(),
    body(`gender`, `gender must be male or female`)
        .notEmpty().bail()
        .isIn(['male', 'female']).bail(),
    validate
]

exports.chatroom = [
    body(`name`, `name is empty`).notEmpty(),
    body(`consultant`, `consultant is empty`).notEmpty(),
    body(`anonym`, `anonym is empty`).notEmpty(),
    body(`chatroom_token`, `chatroom_token is empty`).notEmpty(),
    validate
]
