const router = require("express").Router()
const consultantHandlers = require("../handlers/consultantHandlers")
const rules = require("../validator/rules")

const auth = require("../middleware/auth-express")

router.post('/register', rules.consultant, consultantHandlers.register)
router.post('/login', rules.loginConsultant, consultantHandlers.login)

router.get('/', consultantHandlers.getConsultants)
router.delete('/', auth, consultantHandlers.deleteConsultant)

module.exports = router