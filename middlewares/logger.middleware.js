const logger = require('../services/logger.service')

async function log(req, res, next) {
  logger.info('Req from: ')
  next()
}

module.exports = {
  log
}
