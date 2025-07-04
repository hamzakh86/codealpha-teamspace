import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Droppable, Draggable } from 'react-beautiful-dnd'

import { boardService } from '../../services/board.service'
import { saveTask } from '../../store/board.actions'
import { TaskPreview } from './task-preview'

import { IoClose } from 'react-icons/io5'
import { BsPlusLg } from 'react-icons/bs'

export function TaskList({ group }) {
    const board = useSelector((storeState) => storeState.boardModule.board)
    const tasks = group.tasks

    const [taskToEdit, setTaskToEdit] = useState(boardService.getEmptyTask())
    const [isAddNewTaskOpen, setIsAddNewTaskOpen] = useState(false)

    function handleNewTask({ target }) {
        let { value, name: field } = target
        setTaskToEdit((prevTask) => ({ ...prevTask, [field]: value }))
    }

    function openAddNewTask() {
        setIsAddNewTaskOpen(true)
    }

    function closeAddNewTask() {
        setIsAddNewTaskOpen(false)
        setTaskToEdit(boardService.getEmptyTask())
    }

    function handleKeyPress(ev) {
        if (ev.key === "Enter" && !ev.shiftKey) {
            ev.preventDefault()
            onAddTask(ev)
        }
    }

    async function onAddTask(ev) {
        ev.preventDefault()
        if (!taskToEdit.title) return
        try {
            await saveTask(taskToEdit, group.id, board._id)
            setTaskToEdit(boardService.getEmptyTask())
            closeAddNewTask()
        } catch (err) {
            console.log('Failed to save new task', err)
        }
    }

    return (
        <>
            <section className="task-list-wraper">
                <Droppable droppableId={group.id} key="tasks" type="tasks">
                    {(provided, snapshot) => (
                        <ul
                            className="task-list clean-list tasks"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {tasks.map((task, index) => (
                                <Draggable
                                    key={task.id}
                                    draggableId={task.id}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <li
                                            key={task.id}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <TaskPreview
                                                group={group}
                                                task={task}
                                                board={board}
                                            />
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </section>

            <section className="task-list-bottom">
                {!isAddNewTaskOpen && (
                    <div className="add-a-task-template">
                        <button
                            className="add-a-task"
                            type="button"
                            onClick={openAddNewTask}
                        >
                            <BsPlusLg className="icon-plus" /> Add a card
                        </button>
                    </div>
                )}

                {isAddNewTaskOpen && (
                    <div className="task-composer">
                        <form onSubmit={onAddTask}>
                            <textarea
                                className="task-textarea"
                                type="text"
                                name="title"
                                id={group.id}
                                placeholder="Enter a title for this card..."
                                maxLength="512"
                                spellCheck="false"
                                value={taskToEdit.title}
                                onKeyDown={handleKeyPress}
                                onChange={handleNewTask}
                            ></textarea>

                            <div className="add-task-btns">
                                <div className="add-btns">
                                    <button
                                        className="add-task-btn"
                                        type="submit"
                                    >
                                        Add Card
                                    </button>
                                    <button
                                        className="cancel-btn"
                                        type="button"
                                        onClick={closeAddNewTask}
                                    >
                                        <IoClose className="icon-close" />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </section>
        </>
    )
}