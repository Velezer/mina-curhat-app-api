const router = require("express").Router()
const chatroomHandlers = require("../handlers/chatroomHandlers")
const rules = require("../validator/rules")

// const auth = require("./middleware/auth")

router.post('/', rules.chatroom, chatroomHandlers.createChatroom)

module.exports = router