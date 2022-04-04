const authService = require('./auth.service')
const logger = require('../../services/logger.service')
const jwt = require('jsonwebtoken');
async function login(req, res) {
    const { username, password } = req.body
    try {
        const user = await authService.login(username, password)
        // req.session.user = user
        const accessToken = _getAccessToken(user);
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
        refreshTokens.push(refreshToken);
        res.json({ accessToken, refreshToken, user })
    } catch (err) {
        // logger.error('Failed to Login ' + err)
        res.status(401).send({ err: 'Failed to Login' })
    }
}

async function signup(req, res) {
    try {
        const { username, password, fullname } = req.body
        logger.debug(fullname + ', ' + username)
        const account = await authService.signup(username, password, fullname)
        logger.debug(`auth.route - new account created: ` + JSON.stringify(account))
        const user = await authService.login(username, password)
        req.session.user = user
        res.json(user)
    } catch (err) {
        logger.error('Failed to signup ' + err)
        res.status(500).send({ err: 'Failed to signup' })
    }
}

function _getAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
}

let refreshTokens = []

function refresh(req, res) {
    const { refreshToken } = req.query
    if (refreshToken === null) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    // console.log('refreshToken:', refreshToken);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        delete user.iat;
        const accessToken = _getAccessToken(user)
        res.json({ accessToken })
    })
}

async function logout(req, res) {
    try {
        // req.session.destroy()
        console.log('logged out user', req.session.user.fullname)
        req.session.user = null;
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        res.status(500).send({ err: 'Failed to logout' })
    }
}



module.exports = {
    login,
    signup,
    logout,
    refresh
}