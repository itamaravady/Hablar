const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const socketService = require('../../services/socket.service')
const messageService = require('./message.service')

module.exports = {
    getMessage,
    deleteMessage,
    addMessage,
}

async function getMessage(req, res) {
    try {
        const messages = await messageService.query(req.query)
        res.send(messages)
    } catch (err) {
        logger.error('Cannot get messages', err)
        res.status(500).send({ err: 'Failed to get messages' })
    }
}

async function deleteMessage(req, res) {
    try {
        await messageService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete message', err)
        res.status(500).send({ err: 'Failed to delete message' })
    }
}

async function addMessage(req, res) {
    try {
        var { message, conversationId } = req.body
        message.byUserId = req.session.user._id
        console.log('message,conversationId:', message, conversationId);
        message = await messageService.add(conversationId, message)
        // socketService.broadcast({ type: 'message-added', data: message, userId: message.byUserId })
        // socketService.emitToUser({ type: 'message-about-you', data: message, userId: message.aboutUserId })
        // socketService.emitTo({ type: 'user-updated', data: fullUser, label: fullUser._id })

        res.send(message)

    } catch (err) {
        console.log(err)
        logger.error('Failed to add message', err)
        res.status(500).send({ err: 'Failed to add message' })
    }
}

