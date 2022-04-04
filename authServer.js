require('dotenv').config();

const express = require('express')
const expressSession = require('express-session')
const cors = require('cors')
const path = require('path')

const app = express()
const http = require('http').createServer(app)

// Express App Config
const session = expressSession({
    secret: 'hablar hebrew!',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
});

app.use(express.json())

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')))
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true
    }
    app.use(cors(corsOptions))
}

const authRoutes = require('./api/auth/auth.routes')
// const userRoutes = require('./api/user/user.routes')
const { connectSockets } = require('./services/socket.service')

// routes
app.use('/api/auth', authRoutes)
connectSockets(http, session)

// app.use('/api/user', userRoutes)

const logger = require('./services/logger.service')
const port = process.env.PORT || 3031
http.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})