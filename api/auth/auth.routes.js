const express = require('express')
const { requireAuth } = require('../../middlewares/requireAuth.middleware')

const { login, signup, logout, refresh } = require('./auth.controller')

const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
router.post('/logout', requireAuth, logout)
router.get('/refresh', refresh)

module.exports = router


