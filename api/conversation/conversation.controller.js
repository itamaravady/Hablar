const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const conversationService = require('./conversation.service')

async function getConversation(req, res) {
    try {
        const conversations = await conversationService.query(req.query)
        res.send(conversations)
    } catch (err) {
        logger.error('Cannot get conversations', err)
        res.status(500).send({ err: 'Failed to get conversations' })
    }
}

async function deleteConversation(req, res) {
    try {
        await conversationService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete conversation', err)
        res.status(500).send({ err: 'Failed to delete conversation' })
    }
}


async function addConversation(req, res) {
    try {
        var conversation = req.body
        conversation = await conversationService.add(conversation)
        // socketService.broadcast({ type: 'conversation-added', data: conversation, userId: conversation.byUserId })
        // socketService.emitToUser({ type: 'conversation-about-you', data: conversation, userId: conversation.aboutUserId })
        // socketService.emitTo({ type: 'user-updated', data: fullUser, label: fullUser._id })

        res.send(conversation)

    } catch (err) {
        console.log(err)
        logger.error('Failed to add conversation', err)
        res.status(500).send({ err: 'Failed to add conversation' })
    }
}

module.exports = {
    getConversation,
    deleteConversation,
    addConversation,
    addConversation
}