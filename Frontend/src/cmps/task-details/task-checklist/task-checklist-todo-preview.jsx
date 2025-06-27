import { useState } from 'react'

import { ItemDeleteModal } from '../dynamic-delete-modal'

import { GrClose } from "react-icons/gr"
import { HiDotsHorizontal } from 'react-icons/hi'

export function TodoPreview({ todo, updateTodo, onRemoveTodo }) {
    const [isEditTodoOpen, setIsEditTodoOpen] = useState(false)
    const [isDeleteModalOpen, setDeleteModalOpen] = useState({ todoId: '' })
    const [todoId, setTodoId] = useState('')
    const [currTodo, setCurrTodo] = useState(todo)
    const [currTitle, setCurrTitle] = useState(todo.title)

    function onShowTodoInput(id) {
        setTodoId(id)
        setIsEditTodoOpen(true)
        setCurrTitle(currTodo.title)
    }

    function onCloseTodoInput(ev) {
        if (!ev) return
        if (ev.relatedTarget?.className === 'clean-btn btn-task-details btn-checklist-save') {
            return
        }
        ev.stopPropagation()
        ev.preventDefault()
        setTodoId('')
        setIsEditTodoOpen(false)
        setCurrTitle(currTodo.title)
    }

    function handleChange({ target }) {
        let { value, type } = target
        value = type === 'number' ? +value : value
        setCurrTitle(value)
    }

    function onSaveTodoTitle(ev, id) {
        ev.stopPropagation()
        ev.preventDefault()
        if (todoId === id) {
            const updatedTodo = { ...currTodo, title: currTitle ? currTitle : currTodo.title }
            setCurrTodo(updatedTodo)
            setCurrTitle('')
            onCloseTodoInput(ev)
            updateTodo(ev, updatedTodo)
        }
    }

    function toggleModalDelete(ev, id) {
        ev.stopPropagation()
        ev.preventDefault()
        if (isDeleteModalOpen.todoId === id) {
            setDeleteModalOpen({ todoId: '' })
        } else {
            setDeleteModalOpen({ 'todoId': id })
        }
    }

    return (
        <label className="task-checklist-label" onClick={() => { onShowTodoInput(todo.id) }}>
            {(!isEditTodoOpen || (todoId !== todo.id)) &&
                <span className='task-checklist-label-span'>
                    {currTodo.title}
                </span>}

            {!isEditTodoOpen &&
                <button
                    type="button"
                    className='clean-btn btn-checklist-label-menu-container'
                    onClick={(ev) => toggleModalDelete(ev, todo.id)}>
                    <HiDotsHorizontal className='btn-checklist-label-menu' />
                </button>
            }

            {(isEditTodoOpen && (todoId === todo.id)) &&
                <form>
                    <textarea
                        onBlur={(ev) => onCloseTodoInput(ev)}
                        autoFocus
                        name='title'
                        className='task-todo-title-input'
                        id={todo.id}
                        onChange={handleChange}
                        value={currTitle}
                    ></textarea>

                    <div className='task-checklist-btn'>
                        <button className='clean-btn btn-task-details btn-checklist-save'
                            type="submit" onClick={(ev) => onSaveTodoTitle(ev, (todo.id))}>
                            Save
                        </button>
                        <button className='clean-btn icon-task btn-checklist-cancel-container'
                            type="button"
                            onClick={(ev) => onCloseTodoInput(ev)}
                            style={{ textDecoration: 'none' }}>
                            <GrClose className='btn-checklist-cancel' />
                        </button>
                    </div>
                </form>
            }

            {isDeleteModalOpen.todoId === todo.id && (
                <ItemDeleteModal
                    toggleModalDelete={toggleModalDelete}
                    itemId={todo.id}
                    onRemoveItem={onRemoveTodo}
                    type={'todo'}
                />
            )}
        </label>
    )
}