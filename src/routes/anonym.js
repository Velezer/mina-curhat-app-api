const router = require("express").Router()
const anonymHandlers = require("../handlers/anonymHandlers")
const rules = require("../validator/rules")

router.post('/login', rules.anonym, anonymHandlers.login)

module.exports = router