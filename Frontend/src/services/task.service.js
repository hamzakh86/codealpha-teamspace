
import { boardService } from './board.service'

export const taskService = {
    getById,
    save,
    remove,
    getEmptyTask: boardService.getEmptyTask,
    getEmptyTodo: boardService.getEmptyTodo,
    getEmptyChecklist: boardService.getEmptyChecklist,
    getEmptyAttachment: boardService.getEmptyAttachment
}

async function getById(taskId, groupId, boardId) {
    return boardService.getTaskById(taskId, groupId, boardId)
}

async function remove(taskId, groupId, boardId) {
    return boardService.removeTask(taskId, groupId, boardId)
}

async function save(task, groupId, boardId) {
    return boardService.saveTask(task, groupId, boardId)
}