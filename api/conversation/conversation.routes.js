const express = require('express')
const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const { addConversation, getConversation, deleteConversation } = require('./conversation.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', requireAuth, getConversation)
router.post('/', requireAuth, addConversation)
router.delete('/:id', requireAuth, deleteConversation)

module.exports = router