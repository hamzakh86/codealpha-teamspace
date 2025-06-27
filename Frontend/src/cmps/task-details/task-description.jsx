import { useState } from 'react'

import descriptionIcon from '../../assets/img/icons-task-details/description-icon.svg'

export function TaskDescription({ task, onSaveTask }) {

    const [isEditDescOpen, setIsEditDescOpen] = useState(false)
    const [descToEdit, setDescToEdit] = useState(task.description || '')
    let { description } = task

    function openEditDesc() {
        setDescToEdit(description || '')
        setIsEditDescOpen(true)
    }
    function closeEditDesc(ev) {
        if (!ev) return
        if (ev.relatedTarget?.className === 'clean-btn btn-task-details btn-description-save') {
            return
        }
        setIsEditDescOpen(false)
    }

    function handleChange({ target }) {
        let { value, type } = target
        value = type === 'number' ? +value : value
        setDescToEdit(value)
    }

    async function onSaveDesc(ev) {
        ev.preventDefault()
        let updateTask = { ...task }
        updateTask.description = descToEdit
        onSaveTask(ev, updateTask)
        closeEditDesc(ev)
    }

    return (
        <div className='task-description-container'>
            <img className='icon-task description-icon' src={descriptionIcon} alt="Description" />
            <div className='task-description-title-container'>
                <h3 className='medium-headline task-description-title'>Description</h3>
                {!isEditDescOpen && (
                    <div className='btn-description-edit-container'>
                        <button
                            className='clean-btn btn-task-details btn-description-edit'
                            type="button"
                            onClick={openEditDesc}
                        >
                            Edit
                        </button>
                    </div>
                )}
            </div>

            {!isEditDescOpen && task.description && (
                <p className='task-description-p' onClick={openEditDesc}>
                    {task.description}
                </p>
            )}
            {!isEditDescOpen && !task.description && (
                <p className='task-description-placeholder' onClick={openEditDesc}>
                    Add a more detailed description...
                </p>
            )}

            {isEditDescOpen && (
                <form>
                    <textarea
                        onBlur={closeEditDesc}
                        autoFocus
                        name="description"
                        className='task-description-textarea'
                        id="description"
                        onChange={handleChange}
                        value={descToEdit}
                        placeholder="Add a more detailed description..."
                    ></textarea>
                    <div className='task-description-btn'>
                        <button
                            className='clean-btn btn-task-details btn-description-save'
                            type="submit"
                            onClick={onSaveDesc}
                        >
                            Save
                        </button>
                        <button
                            className='clean-btn btn-description-cancel btn-task-details btn-description-cancel'
                            type="button"
                            onClick={closeEditDesc}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}