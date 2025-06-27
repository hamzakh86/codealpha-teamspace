import taskTitle from '../../assets/img/icons-task-details/taskTitle.svg'

export function TaskTitle({ handleChange, onSaveEdit, task, group, onOpenModal, moveCardBtn }) {

    function openMoveModal(e) {
        e.preventDefault()
        onOpenModal('move card')
    }

    return (
        <section className='task-title-container'>
            <div>
                <img className='icon-task title-icon' src={taskTitle} alt="Task title" />
            </div>

            <div>
                <form onBlurCapture={onSaveEdit}>
                    <input
                        type="text"
                        className='task-details-title-input'
                        name="title"
                        id="title"
                        onChange={handleChange}
                        defaultValue={task.title}
                    />
                </form>
                <p className='task-details-title-location'>
                    in list{' '}
                    <button
                        ref={moveCardBtn}
                        onClick={openMoveModal}
                        className='task-details-title-location-link'
                        type="button"
                    >
                        {group.title}
                    </button>
                </p>
            </div>
        </section>
    )
}