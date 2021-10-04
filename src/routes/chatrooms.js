const router = require("express").Router()
const chatroomHandlers = require("../handlers/chatroomHandlers")
const rules = require("../validator/rules")

const auth = require("../middleware/auth-express")

router.post('/', auth, rules.chatroom, chatroomHandlers.createChatroom)
router.get('/', auth, chatroomHandlers.getChatrooms)
router.get('/:_id', auth, chatroomHandlers.getChatroomsById)

module.exports = router