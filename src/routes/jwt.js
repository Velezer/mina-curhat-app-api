const router = require("express").Router()
const jwtHandlers = require("../handlers/jwtHandlers")
const rules = require("../validator/rules")

router.post('/login', rules.jwt, jwtHandlers.login)

module.exports = router