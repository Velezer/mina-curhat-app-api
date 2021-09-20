const router = require("express").Router()
const consultantHandlers = require("../handlers/consultantHandlers")
const rules = require("../validator/rules")


router.post('/register', rules.consultant, consultantHandlers.register)
router.post('/login', rules.consultant, consultantHandlers.login)

module.exports = router