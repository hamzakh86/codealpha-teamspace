const express = require('express')
const {
	requireAuth,
	requireAdmin,
} = require('../../middlewares/requireAuth.middleware')
const {
	getUser,
	getUsers,
	deleteUser,
	updateUser,
	changePassword,
} = require('./user.controller')
const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/:id', updateUser)
router.put('/:id/password', changePassword)
router.delete('/:id', deleteUser)

module.exports = router
