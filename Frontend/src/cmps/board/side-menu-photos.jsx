import { useEffect, useState } from 'react'
import { unsplashService } from '../../services/unsplash.service'
import Loader from '../../assets/img/loader.svg'

export function SideMenuPhotos({ changeBackground }) {
    const [photos, setPhotos] = useState(null)
    const [searchTxt, setSearchTxt] = useState('')

    useEffect(() => {
        getPhotos()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function getPhotos(txt = searchTxt) {
        try {
            const photos = await unsplashService.getPhotos(txt)
            setPhotos(photos)
        } catch (err) {
            console.log('Failed to get photos')
        }
    }

    const onSearchPhotos = (ev) => {
        ev.preventDefault()
        if (!searchTxt) return
        setPhotos(null)
        getPhotos(searchTxt)
    }

    const handleChange = ({ target }) => {
        setSearchTxt(target.value)
    }

    return (
        <section className="side-menu-photos">
            <form onSubmit={onSearchPhotos}>
                <div className="search-photos-input-container">
                    <input
                        placeholder="Photos"
                        type="text"
                        className="search-photos-input"
                        value={searchTxt}
                        onChange={handleChange}
                    />
                </div>
            </form>
            {photos ? (
                <div className="photo-list-wrapper">
                    <ul className="clean-list photo-list">
                        {photos.map((photo) => (
                            <li
                                key={photo.background}
                                className="display hover-darker"
                                style={{
                                    background: `url('${photo.thumbnail}') center center / cover`,
                                }}
                                onClick={() => changeBackground(photo)}
                            ></li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="loader-wrapper">
                    <img className="loader" src={Loader} alt="loader" />
                </div>
            )}
        </section>
    )
}