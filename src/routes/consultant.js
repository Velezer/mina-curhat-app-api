const router = require("express").Router()
const consultantHandlers = require("../handlers/consultantHandlers")
const rules = require("../validator/rules")



router.post('/register', rules.consultant, consultantHandlers.register)

module.exports = router