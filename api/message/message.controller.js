const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const socketService = require('../../services/socket.service')
const messageService = require('./message.service')

module.exports = {
    getMessage,
    deleteMessage,
    addMessage,
    getBotMessage
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

function _parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

async function addMessage(req, res) {
    try {
        var { message, conversationId } = req.body
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        const user = _parseJwt(token)
        message.byUserId = user._id
        message = await messageService.add(conversationId, message);
        res.send(message);

    } catch (err) {
        console.log(err)
        logger.error('Failed to add message', err)
        res.status(500).send({ err: 'Failed to add message' })
    }
};


async function getBotMessage(req, res) {
    try {
        const message = await messageService.queryBot();
        console.log('######message:', message);
        res.send(message)
    } catch (err) {
        logger.error('Cannot get messages', err)
        res.status(500).send({ err: 'Failed to get messages' })
    }
}

