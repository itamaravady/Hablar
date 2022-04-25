const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { getUser, getUsers, deleteUser, updateUser, getUserByName } = require('./user.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/getByUsername', requireAuth, getUserByName);
router.get('/:id', requireAuth, getUser)
router.put('/:id', requireAuth, updateUser)
router.get('/', requireAuth, getUsers)

// router.put('/:id',  requireAuth, updateUser)
router.delete('/:id', requireAuth, requireAdmin, deleteUser)

module.exports = router