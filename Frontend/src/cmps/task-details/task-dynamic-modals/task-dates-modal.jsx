import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export function TaskDatesModal({ task, data, onSaveTask, onClose }) {
    const [selectedDate, setSelectedDate] = useState(task.dueDate ? new Date(task.dueDate) : new Date())

    const onAddDueDate = (ev) => {
        ev.preventDefault()
        const dueDate = new Date(selectedDate).getTime()
        const updatedTask = { ...task, dueDate }
        onSaveTask(ev, updatedTask)
        onClose()
    }

    const onRemoveDueDate = (ev) => {
        ev.preventDefault()
        const updatedTask = { ...task, dueDate: null }
        onSaveTask(ev, updatedTask)
        onClose()
    }

    return (
        <section className="dates">
            <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                calendarClassName="calendar"
                inline
            />

            <div className="dates-actions">
                <button
                    type="button"
                    onClick={onAddDueDate}
                    className="btn-dates save"
                >
                    Save
                </button>
                <button
                    type="button"
                    onClick={onRemoveDueDate}
                    className="clean-btn btn-dates remove"
                >
                    Remove
                </button>
            </div>
        </section>
    )
}