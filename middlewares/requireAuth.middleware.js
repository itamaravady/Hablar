require('dotenv').config();

const logger = require('../services/logger.service')
const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token === null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.sendStatus(403);
    }
    next();
  })
  // if (!req.session || !req.session.user) {
  //   res.status(401).send('Not authenticated, Please Login')
  //   return
  // }
  // next()
}

function requireAdmin(req, res, next) {
  const user = req.session.user
  if (!user.isAdmin) {
    logger.warn(user.fullname + ' Attempt to perform admin action')
    res.status(403).end('Unauthorized Enough..')
    return
  }
  next()
}


// module.exports = requireAuth

module.exports = {
  requireAuth,
  requireAdmin
}
