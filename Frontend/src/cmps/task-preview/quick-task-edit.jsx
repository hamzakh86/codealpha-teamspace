import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { saveTask, removeTask } from '../../store/board.actions'
import { DynamicModal } from '../dynamic-modal'

import { BsPerson, BsSquareHalf, BsArchive } from "react-icons/bs"
import { AiOutlineClockCircle } from "react-icons/ai"
import { FiArrowRight } from "react-icons/fi"
import { MdContentCopy } from "react-icons/md"
import { TiTag } from "react-icons/ti"
import { ReactComponent as OpenTaskSvg } from '../../assets/img/icons-task-details/taskTitle.svg'

export function QuickTaskEdit({ refDataBtn, task, taskId, groupId, boardId, toggleQuickTaskEdit }) {
    const navigate = useNavigate()
    const [taskToEdit, setTaskToEdit] = useState(task)
    const [modalStyle, setModalStyle] = useState(false)
    // const [modalHeight, setModalHeight] = useState() // <-- Remove unused variable
    const [modalType, setModalType] = useState('')

    const modalRef = useRef(null)
    const modalBtnsRef = useRef()
    const labelBtn = useRef()
    const memberBtn = useRef()
    const coverBtn = useRef()
    const datesBtn = useRef()
    const moveCardBtn = useRef()

    function handleChange({ target }) {
        let { value, type, name: field } = target
        value = type === 'number' ? +value : value
        setTaskToEdit((prevTask) => ({ ...prevTask, [field]: value }))
    }

    function handleKeyPress(ev) {
        if (ev.key === "Enter" && !ev.shiftKey) {
            ev.preventDefault()
            onSaveEdit()
            toggleQuickTaskEdit()
        }
    }

    useEffect(() => {
        setModalStyle(true)
        // if (modalRef.current) {
        //     setModalHeight(modalRef.current.getBoundingClientRect().height)
        // }
    }, [modalStyle])

    function getModalPos(refDataBtn) {
        const rect = refDataBtn.current.getBoundingClientRect()
        let topModal = rect.top - 14
        let leftModal = rect.left - 228
        return { top: topModal, left: leftModal }
    }

    function getRefData(type) {
        switch (type) {
            case 'members':
                return memberBtn
            case 'labels':
                return labelBtn
            case 'dates':
                return datesBtn
            case 'cover':
                return coverBtn
            case 'move card':
                return moveCardBtn
            default:
                return null
        }
    }

    async function onSaveEdit(ev) {
        if (ev) ev.preventDefault()
        try {
            await saveTask(taskToEdit, groupId, boardId)
        } catch (err) {
            console.log('Cannot update task ', err)
        }
    }

    async function onCopyTask() {
        let copyTask = { ...taskToEdit }
        copyTask.id = null
        try {
            await saveTask(copyTask, groupId, boardId)
        } catch (err) {
            console.log('Cannot copy task', err)
        }
    }

    async function onRemoveTask() {
        try {
            await removeTask(taskId, groupId, boardId)
            navigate(`/board/${boardId}`)
        } catch (err) {
            console.log('Cannot remove task ', err)
        }
    }

    function onOpenCard() {
        navigate(`/board/${boardId}/${groupId}/${taskId}`)
    }

    function onOpenModal(ev, type) {
        ev.stopPropagation()
        ev.preventDefault()
        setModalType(type)
    }

    return (
        <>
            <section className="quick-task-edit"
                style={getModalPos(refDataBtn)}
                ref={modalRef}>

                <div className="quick-task-edit-screen"></div>

                <section className="open-task">
                    <form onSubmit={onSaveEdit}>
                        <textarea
                            autoFocus
                            className="open-task-title"
                            name="title"
                            id="taskId"
                            spellCheck="false"
                            onChange={handleChange}
                            onKeyDown={handleKeyPress}
                            defaultValue={task.title}
                        />
                        <button type="submit">Save</button>
                    </form>
                </section>

                <section className="quick-edit-btns" ref={modalBtnsRef}>
                    <button className="quick-btn"
                        type="button"
                        onClick={onOpenCard} >
                        <OpenTaskSvg /> Open card
                    </button>

                    <button className="quick-btn"
                        type="button"
                        ref={labelBtn}
                        onClick={(ev) => onOpenModal(ev, 'labels')} >
                        <TiTag className="tag-svg" /> Edit labels
                    </button>

                    <button className="quick-btn"
                        type="button"
                        ref={memberBtn}
                        onClick={(ev) => onOpenModal(ev, 'members')} >
                        <BsPerson /> Change members
                    </button>

                    <button className="quick-btn"
                        type="button"
                        ref={coverBtn}
                        onClick={(ev) => onOpenModal(ev, 'cover')} >
                        <BsSquareHalf className='cover-svg' /> Change cover
                    </button>

                    <button className="quick-btn"
                        type="button"
                        ref={moveCardBtn}
                        onClick={(ev) => onOpenModal(ev, 'move card')} >
                        <FiArrowRight /> Move
                    </button>

                    <button className="quick-btn"
                        type="button"
                        onClick={onCopyTask}>
                        <MdContentCopy className="copy-svg" /> Copy
                    </button>

                    <button className="quick-btn"
                        type="button"
                        ref={datesBtn}
                        onClick={(ev) => onOpenModal(ev, 'dates')}>
                        <AiOutlineClockCircle /> Edit dates
                    </button>

                    <button className="quick-btn"
                        type="button"
                        onClick={onRemoveTask}>
                        <BsArchive /> Remove
                    </button>

                    {modalType && <DynamicModal
                        cmpType={modalType}
                        refDataBtn={getRefData(modalType)}
                        task={task}
                        groupId={groupId}
                        boardId={boardId}
                        onOpenModal={onOpenModal}
                        onSaveEdit={onSaveEdit} />}
                </section>
            </section>
        </>
    )
}