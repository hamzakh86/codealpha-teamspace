import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { QuickTaskEdit } from './quick-task-edit'
import { saveTask } from '../../store/board.actions'
import { utilService } from '../../services/util.service'

import { BiPencil } from 'react-icons/bi'
import { FaRegComment } from 'react-icons/fa'
import { FiPaperclip } from 'react-icons/fi'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { BsCheck2Square } from 'react-icons/bs'
import { GrTextAlignFull } from 'react-icons/gr'

export function TaskPreview({ group, task, board }) {
    const { boardId } = useParams()
    const navigate = useNavigate()

    const [quickTaskEdit, setQuickTaskEdit] = useState(false)
    const quickEditBtn = useRef()

    const currLabels = task.labelIds
    const currMembers = task.memberIds
    const currCover = task.style
    const currComments = task.comments
    const currAttach = task?.attachments
    const currDueDate = task.dueDate

    // Calculate checklist progress
    const totalTodosCount = task.checklists?.reduce((acc, checklist) => acc + checklist.todos.length, 0) || 0
    const completedTodosCount = task.checklists?.reduce(
        (acc, checklist) => acc + checklist.todos.filter(todo => todo.isDone).length,
        0
    ) || 0
    const totalTodos = `${completedTodosCount}/${totalTodosCount}`
    const todosStyle = totalTodosCount > 0 && completedTodosCount === totalTodosCount ? 'todosDone' : ''

    const fullMembers = currMembers
        ? utilService.findDataById(currMembers, board, 'members')
        : []

    const fullLabels = currLabels
        ? utilService.findDataById(currLabels, board, 'labels')
        : []

    function onQuickTaskEdit(ev) {
        ev.stopPropagation()
        setQuickTaskEdit((prev) => !prev)
    }

    function onTask() {
        navigate(`/board/${boardId}/${group.id}/${task.id}`)
    }

    function onLabel(ev) {
        ev.stopPropagation()
    }

    function getDueWarnSpan(task) {
        if (task?.isDone) return 'due-sticker completed'
        if (!task.dueDate) return ''
        const taskDuedate = new Date(task.dueDate)
        const now = new Date()
        const msBetweenDates = taskDuedate.getTime() - now.getTime()
        const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000)
        if (hoursBetweenDates < 0) return 'due-sticker overdue'
        if (hoursBetweenDates < 24) return 'due-sticker soon'
        return ''
    }

    function onToggleDateDone(ev, task) {
        ev.stopPropagation()
        const updatedTask = { ...task, isDone: !task.isDone }
        saveTask(updatedTask, group.id, boardId)
    }

    return (
        <>
            <section className="task-preview" onClick={onTask}>
                {currCover?.backgroundColor && (
                    <div
                        className="task-preview-cover"
                        style={currCover}>
                    </div>
                )}

                {currCover?.background && (
                    <div
                        className="task-preview-cover img"
                        style={currCover}>
                    </div>
                )}

                <button className="edit-btn"
                    type="button"
                    onClick={onQuickTaskEdit}
                    ref={quickEditBtn}>
                    <BiPencil />

                    {quickTaskEdit && (
                        <QuickTaskEdit
                            taskId={task.id}
                            groupId={group.id}
                            boardId={boardId}
                            task={task}
                            onEdit={onQuickTaskEdit}
                            toggleQuickTaskEdit={setQuickTaskEdit}
                            quickTaskEdit={quickTaskEdit}
                            refDataBtn={quickEditBtn}
                        />
                    )}
                </button>

                <section className='task-preview-details'>
                    <div className="task-preview-label-container">
                        {fullLabels.map((label) => (
                            <li
                                key={label.id}
                                style={{ backgroundColor: label.color }}
                                className="task-preview-label"
                                onClick={onLabel}
                            ></li>
                        ))}
                    </div>

                    <p className="task-title" onClick={onTask}>
                        {task.title}
                    </p>

                    <div className="task-preview-actions-wrapper">
                        <div className="task-preview-actions">
                            {currDueDate && (
                                <span className={getDueWarnSpan(task)}
                                    onClick={(ev) => onToggleDateDone(ev, task)}>
                                    <span className='task-preview-actions-icons date'>
                                        <AiOutlineClockCircle className='date' />
                                        <p>{utilService.dueDateFormat(currDueDate)}</p>
                                    </span>
                                </span>
                            )}

                            {task?.description && (
                                <span className="task-preview-actions-icons desc">
                                    <GrTextAlignFull size={11} />
                                </span>
                            )}

                            {currComments?.length > 0 && (
                                <span className="task-preview-actions-icons comment">
                                    <FaRegComment size={11} />
                                    <p>{currComments.length}</p>
                                </span>
                            )}

                            {currAttach?.length > 0 && (
                                <span className="task-preview-actions-icons attach">
                                    <FiPaperclip size={11} />
                                    <p>{currAttach.length}</p>
                                </span>
                            )}

                            {task.checklists?.length > 0 && (
                                <span className={todosStyle}>
                                    <span className="task-preview-actions-icons check">
                                        <BsCheck2Square />
                                        <p>{totalTodos}</p>
                                    </span>
                                </span>
                            )}
                        </div>

                        <div className='task-preview-actions-member-wrapper'>
                            <ul className="task-preview-member-container clean-list">
                                {fullMembers.map((member) => (
                                    <li
                                        key={member._id}
                                        className="task-preview-member"
                                        onClick={onLabel}
                                    >
                                        <img
                                            className="member-img"
                                            height="28px"
                                            width="28px"
                                            src={member.imgUrl}
                                            alt={member.fullname}
                                            title={member.fullname}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            </section>
        </>
    )
}