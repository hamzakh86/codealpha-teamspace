const userService = require('./user.service')
const socketService = require('../../services/socket.service')
const logger = require('../../services/logger.service')

async function getUser(req, res) {
	try {
		const user = await userService.getById(req.params.id)
		res.send(user)
	} catch (err) {
		logger.error('Failed to get user', err)
		res.status(500).send({ err: 'Failed to get user' })
	}
}

async function getUsers(req, res) {
	try {
		// const filterBy = {
		//     txt: req.query?.txt || '',
		//     minBalance: +req.query?.minBalance || 0
		// }
		const users = await userService.query()
		res.send(users)
	} catch (err) {
		logger.error('Failed to get users', err)
		res.status(500).send({ err: 'Failed to get users' })
	}
}

async function deleteUser(req, res) {
	try {
		await userService.remove(req.params.id)
		res.send({ msg: 'Deleted successfully' })
	} catch (err) {
		logger.error('Failed to delete user', err)
		res.status(500).send({ err: 'Failed to delete user' })
	}
}

async function updateUser(req, res) {
	try {
		const user = req.body
		// Ensure _id comes from params if not in body
		user._id = user._id || req.params.id
		const savedUser = await userService.update(user)
		res.send(savedUser)
	} catch (err) {
		logger.error('Failed to update user', err)
		res.status(500).send({ err: 'Failed to update user' })
	}
}

async function changePassword(req, res) {
	try {
		const { id } = req.params
		const { oldPassword, newPassword } = req.body
		if (!newPassword || newPassword.length < 6) {
			return res.status(400).send({ err: 'Le nouveau mot de passe doit contenir au moins 6 caractères' })
		}
		const result = await userService.changePassword(id, oldPassword, newPassword)
		res.send(result)
	} catch (err) {
		logger.error('Failed to change password', err)
		res.status(400).send({ err: err.message || 'Échec du changement de mot de passe' })
	}
}

module.exports = {
	getUser,
	getUsers,
	deleteUser,
	updateUser,
	changePassword,
}
