import { userService } from './user.service'
import { utilService } from './util.service'
import { boardService } from './board.service'

export const activityService = {
	createActivity,
	addActivityToBoard,
}

function createActivity(txt, task = null, user = null, comment = null) {
	const miniUser = user || userService.getLoggedinUser()
	const miniTask = task ? { id: task.id, title: task.title } : null

	const activity = {
		id: utilService.makeId(),
		txt,
		createdAt: Date.now(),
		byMember: miniUser,
		task: miniTask,
	}

	if (comment) activity.comment = comment
	return activity
}

async function addActivityToBoard(board, txt, task = null, user = null, comment = null) {
	const activity = createActivity(txt, task, user, comment)
	if (!board.activities) board.activities = []
	board.activities.unshift(activity)
	return await boardService.save(board)
}