const express = require('express')
const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { addMessage, getMessage, deleteMessage } = require('./message.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getMessage)
router.post('/', log, requireAuth, addMessage)
router.delete('/:id', requireAuth, deleteMessage)

module.exports = router