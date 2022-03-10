const express = require('express')
const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { addConversation, getConversation, deleteMessage } = require('./message.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getConversation)
router.post('/', log, requireAuth, addConversation)
router.delete('/:id', requireAuth, deleteMessage)

module.exports = router