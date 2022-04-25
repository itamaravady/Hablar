// const asyncLocalStorage = require('./als.service');
const logger = require('./logger.service');
const jwt = require('jsonwebtoken');

var gIo = null

function connectSockets(http) {
    gIo = require('socket.io')(http, {
        cors: {
            origin: '*',
        }
    })

    gIo.use((socket, next) => {
        if (socket.handshake.query?.accessToken) {
            jwt.verify(socket.handshake.query.accessToken, process.env.ACCESS_TOKEN_SECRET, function (err, user) {
                if (err) return next(new Error('Authentication error'));
                socket.user = user;
                next();
            });
        }
        else {
            next(new Error('Authentication error'));
        }
    })
        .on('connection', socket => {
            console.log('New socket', socket.id)
            socket.on('disconnect', socket => {
                console.log('Someone disconnected', socket.id)
            })
            socket.on('join conversation', conversationId => {
                if (socket[conversationId]) return;

                socket.join(conversationId)
                socket[conversationId] = [conversationId]
            })
            socket.on('new message', params => {
                const { toUserId } = params.message;
                console.log('🎏message.toUserId:🎏', params.message);

                socket.to(toUserId).emit('new message', params);
            })
            socket.on('new bot message', params => {
                const { toUserId } = params.message;
                console.log('🤖message.toUserId:🤖', params.message);

                gIo.to(toUserId).emit('new bot message', params);
            })
        })
}

module.exports = {
    connectSockets,
}