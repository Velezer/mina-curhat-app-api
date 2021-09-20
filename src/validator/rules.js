const { body } = require('express-validator');


exports.consultant = [
    body(`name`, `name is empty`).notEmpty(),
    body(`password`, `password is empty`).notEmpty(),
]

exports.chatroom = [
    body(`name`, `name is empty`).notEmpty(),
]