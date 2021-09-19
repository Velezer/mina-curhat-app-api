const router = require("express").Router()
const consultantHandlers = require("../handlers/consultantHandlers")

router.post('/consultant/register', consultantHandlers.register)
router.post('/consultant/login', consultantHandlers.login)

module.exports = router