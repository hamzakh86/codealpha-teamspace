const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

function _safeObjectId(id) {
	try {
		if (typeof id === 'string' && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
			return ObjectId(id)
		}
	} catch (e) {}
	return id
}

async function query() {
	try {
		const collection = await dbService.getCollection('board')
		var boards = await collection.find().toArray()
		return boards.map(b => ({
			...b,
			_id: b._id ? b._id.toString() : (b.id ? b.id.toString() : '')
		}))
	} catch (err) {
		logger.error('cannot find boards', err)
		throw err
	}
}

async function getById(boardId) {
	try {
		const collection = await dbService.getCollection('board')
		const objId = _safeObjectId(boardId)
		let board = await collection.findOne({ _id: objId })
		if (!board && objId !== boardId) {
			board = await collection.findOne({ _id: boardId })
		}
		if (!board) {
			board = await collection.findOne({ id: boardId })
		}
		if (board && !board._id) {
			board._id = board.id || boardId
		}
		return board
	} catch (err) {
		logger.error(`while finding board ${boardId}`, err)
		throw err
	}
}

async function remove(boardId) {
	try {
		const collection = await dbService.getCollection('board')
		const objId = _safeObjectId(boardId)
		let res = await collection.deleteOne({ _id: objId })
		if ((!res || !res.deletedCount) && objId !== boardId) {
			await collection.deleteOne({ _id: boardId })
		}
		return boardId
	} catch (err) {
		logger.error(`cannot remove board ${boardId}`, err)
		throw err
	}
}

async function add(board) {
	try {
		if (!board._id) {
			board._id = 'b_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)
		}
		const collection = await dbService.getCollection('board')
		await collection.insertOne(board)
		return board
	} catch (err) {
		logger.error('cannot insert board', err)
		throw err
	}
}

async function update(board) {
	try {
		const boardToSave = {
			title: board.title,
			isStarred: board.isStarred,
			archivedAt: board.archivedAt,
			createdBy: board.createdBy,
			style: board.style,
			labels: board.labels,
			members: board.members,
			groups: board.groups,
			activities: board.activities || [],
			cmpsOrder: board.cmpsOrder || [],
			description: board.description || '',
		}
		const collection = await dbService.getCollection('board')
		const objId = _safeObjectId(board._id)
		await collection.updateOne(
			{ _id: objId },
			{ $set: boardToSave }
		)
		return board
	} catch (err) {
		logger.error(`cannot update board ${board._id}`, err)
		throw err
	}
}

module.exports = {
	remove,
	query,
	getById,
	add,
	update,
}
