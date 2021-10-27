const router = require("express").Router()
const consultantHandlers = require("../handlers/consultantHandlers")
const rules = require("../validator/rules")


router.post('/register', rules.consultant, consultantHandlers.register)
router.post('/login', rules.loginConsultant, consultantHandlers.login)

router.get('/', consultantHandlers.getConsultants)

module.exports = router