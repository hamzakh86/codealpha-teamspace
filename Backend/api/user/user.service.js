const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
	query,
	getById,
	getByUsername,
	getByEmail,
	add,
	update,
	remove,
	changePassword,
}

function _safeObjectId(id) {
	try {
		if (typeof id === 'string' && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
			return ObjectId(id)
		}
	} catch (e) {}
	return id
}

async function query(filterBy = {}) {
	const criteria = _buildCriteria(filterBy)
	try {
		const collection = await dbService.getCollection('user')
		var users = await collection.find(criteria).toArray()
		users = users.map((user) => {
			delete user.password
			try {
				if (typeof user._id === 'string' && user._id.length === 24 && /^[0-9a-fA-F]{24}$/.test(user._id)) {
					user.createdAt = ObjectId(user._id).getTimestamp()
				} else {
					user.createdAt = user.createdAt || new Date().toISOString()
				}
			} catch (e) {
				user.createdAt = user.createdAt || new Date().toISOString()
			}
			return user
		})
		return users
	} catch (err) {
		logger.error('cannot find users', err)
		throw err
	}
}

async function getById(userId) {
	try {
		const collection = await dbService.getCollection('user')
		const objId = _safeObjectId(userId)
		let user = await collection.findOne({ _id: objId })
		if (!user && objId !== userId) {
			user = await collection.findOne({ _id: userId })
		}
		if (user) delete user.password
		return user
	} catch (err) {
		logger.error(`while finding user by id: ${userId}`, err)
		throw err
	}
}

async function getByUsername(username) {
	try {
		const collection = await dbService.getCollection('user')
		// NOTE: keep password in result so auth.service can compare it
		const user = await collection.findOne({ username })
		return user || null
	} catch (err) {
		logger.error(`while finding user by username: ${username}`, err)
		throw err
	}
}

async function getByEmail(email) {
	try {
		const collection = await dbService.getCollection('user')
		const user = await collection.findOne({ email: email.toLowerCase().trim() })
		return user || null
	} catch (err) {
		logger.error(`while finding user by email: ${email}`, err)
		throw err
	}
}

async function add(user) {
	try {
		const userToAdd = {
			_id: user._id || ('u_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)),
			username: user.username,
			password: user.password || null,
			fullname: user.fullname || user.name || 'Utilisateur',
			email: user.email || `${user.username}@collabflow.io`,
			imgUrl: user.imgUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
			isGoogleAuth: !!user.isGoogleAuth,
			createdAt: new Date().toISOString()
		}
		const collection = await dbService.getCollection('user')
		await collection.insertOne(userToAdd)
		return userToAdd
	} catch (err) {
		logger.error('cannot add user', err)
		throw err
	}
}

async function update(user) {
	try {
		const collection = await dbService.getCollection('user')
		const objId = _safeObjectId(user._id)
		const updateDoc = { ...user }
		delete updateDoc._id
		delete updateDoc.password // do not accidentally overwrite password in regular update

		const result = await collection.updateOne(
			{ _id: objId },
			{ $set: updateDoc }
		)
		// Also try string _id if ObjectId update found nothing
		if (result.matchedCount === 0) {
			await collection.updateOne({ _id: user._id }, { $set: updateDoc })
		}
		const updated = await getById(user._id)
		return updated || user
	} catch (err) {
		logger.error('cannot update user', err)
		throw err
	}
}

async function remove(userId) {
	try {
		const collection = await dbService.getCollection('user')
		const objId = _safeObjectId(userId)
		let res = await collection.deleteOne({ _id: objId })
		if (res.deletedCount === 0 && objId !== userId) {
			res = await collection.deleteOne({ _id: userId })
		}
		logger.info(`User ${userId} deleted successfully`)
		return res.deletedCount
	} catch (err) {
		logger.error(`cannot remove user ${userId}`, err)
		throw err
	}
}

async function changePassword(userId, oldPassword, newPassword) {
	try {
		const collection = await dbService.getCollection('user')
		const objId = _safeObjectId(userId)
		let user = await collection.findOne({ _id: objId })
		if (!user && objId !== userId) {
			user = await collection.findOne({ _id: userId })
		}
		if (!user) throw new Error('Utilisateur introuvable')

		const bcrypt = require('bcrypt')
		// Verify old password if user already has a password
		if (user.password) {
			const match = await bcrypt.compare(oldPassword, user.password)
			if (!match && oldPassword !== user.password) {
				throw new Error('Ancien mot de passe incorrect')
			}
		}

		const saltRounds = 10
		const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

		await collection.updateOne(
			{ _id: user._id },
			{ $set: { password: hashedPassword } }
		)
		logger.info(`Password changed for user ${userId}`)
		return { msg: 'Mot de passe mis à jour avec succès' }
	} catch (err) {
		logger.error(`cannot change password for user ${userId}`, err)
		throw err
	}
}

function _buildCriteria(filterBy) {
	const criteria = {}
	if (filterBy.txt) {
		const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
		criteria.$or = [
			{
				username: txtCriteria,
			},
			{
				fullname: txtCriteria,
			},
		]
	}
	if (filterBy.email) {
		criteria.email = filterBy.email
	}
	if (filterBy.minBalance) {
		criteria.score = { $gte: filterBy.minBalance }
	}
	return criteria
}
