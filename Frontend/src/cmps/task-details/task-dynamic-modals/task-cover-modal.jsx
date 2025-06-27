import { useState } from 'react'
import Loader from '../../../assets/img/loader.svg'

export function TaskCoverModal({ task, onSaveTask }) {

    const coverColors = [
        '#7BC86C',
        '#F5DD29',
        '#FFAF3F',
        '#EF7564',
        '#CD8DE5',
        '#5BA4CF',
        '#29CCE5',
        '#6DECA9',
        '#FF8ED4',
        '#172B4D'
    ]

    const coverImgs = [
        'https://images.unsplash.com/photo-1672091161606-71d1cf383221?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MDE5NDJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NzQ0Njg0MzQ&ixlib=rb-4.0.3&q=80',
        'https://images.unsplash.com/photo-1672167630747-35dd70a83994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MDE5NDJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NzQ0Njg0MzQ&ixlib=rb-4.0.3&q=80',
        'https://images.unsplash.com/photo-1673212815770-16f0a1f1500f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MDE5NDJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NzQ0Njg0MzQ&ixlib=rb-4.0.3&q=80',
        'https://images.unsplash.com/photo-1673725437336-e2f3307cebbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MDE5NDJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NzQ0Njg0MzQ&ixlib=rb-4.0.3&q=80',
        'https://images.unsplash.com/photo-1672575395994-835afaaeb376?crop=entropy&cs=tinysrgb&fm=jpg&ixid=Mnw0MDE5NDJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NzQ1MDcwNzU&ixlib=rb-4.0.3&q=80',
        'https://images.unsplash.com/photo-1673026066090-d52723e12d70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MDE5NDJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NzQ1MDcwNzU&ixlib=rb-4.0.3&q=80'
    ]

    // Track which color or image is currently selected as cover
    const [selectedColor, setSelectedColor] = useState(task.style?.backgroundColor || '')
    const [selectedImg, setSelectedImg] = useState(
        task.style?.background?.startsWith('url("') ? task.style.background.match(/url\("([^"]+)"\)/)?.[1] : ''
    )

    function setTaskCover(ev, currColor, currImg) {
        let updateTask = { ...task }
        if (!updateTask.style) updateTask.style = {}

        if (currColor) {
            if (updateTask.style.backgroundColor === currColor) {
                updateTask.style.backgroundColor = ''
                setSelectedColor('')
            } else {
                updateTask.style.background = ''
                updateTask.style.backgroundColor = currColor
                setSelectedColor(currColor)
                setSelectedImg('')
            }
            onSaveTask(ev, updateTask)
        } else if (currImg) {
            const imgUrl = `url("${currImg}") center center / cover`
            if (updateTask.style.background === imgUrl) {
                updateTask.style.background = ''
                setSelectedImg('')
            } else {
                updateTask.style.backgroundColor = ''
                updateTask.style.background = imgUrl
                setSelectedImg(currImg)
                setSelectedColor('')
            }
            onSaveTask(ev, updateTask)
        }
    }

    return (
        <section className='cmp-dynamic-options-list cover-section'>
            {(!coverColors || !coverImgs) &&
                <div className="loader-wrapper">
                    <img className="loader" src={Loader} alt="loader" />
                </div>}
            <div className='cover-section-block colors'>
                <h3 className='small-headline cmp-dynamic-options-title'>Colors</h3>
                <div className='color-wrapper clean-list'>
                    {coverColors.map((color) => (
                        <li key={color} className={color}>
                            <button
                                type="button"
                                className={`color-btn${selectedColor === color ? ' selected' : ''}`}
                                onClick={(ev) => setTaskCover(ev, color, undefined)}
                                style={{ backgroundColor: color }}
                                aria-label={`Set cover color ${color}`}
                            />
                        </li>
                    ))}
                </div>
            </div>

            <div className='cover-section-block attachments'>
                <h3 className='small-headline cmp-dynamic-options-title'>Attachments</h3>
                <button className='cover-upload-btn' type="button">
                    Upload a cover image
                </button>
            </div>

            <div className='cover-section-block unsplash'>
                <h3 className='small-headline cmp-dynamic-options-title'>Photos from Unsplash</h3>
                <div className='img-wrapper clean-list'>
                    {coverImgs.map((img) => (
                        <li key={img} className={img}>
                            <button
                                type="button"
                                className={`img-btn${selectedImg === img ? ' selected' : ''}`}
                                onClick={(ev) => setTaskCover(ev, undefined, img)}
                                style={{ background: `url('${img}') center center / cover` }}
                                aria-label="Set cover image"
                            />
                        </li>
                    ))}
                </div>
                <small>By using images from Unsplash, you agree to their license and Terms of Service</small>
            </div>
        </section>
    )
}