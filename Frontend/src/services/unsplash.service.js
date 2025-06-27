import axios from 'axios'

export const unsplashService = {
    getPhotos,
}

// * for dev purposes
const hardCodedPhotos = [
    // ...existing hardCodedPhotos array...
]

const STORAGE_KEY = 'photos'
const API_KEY = 'JRY734h_KdVD-02lIwlrBk6TQnUCv29JyIqGjCYYVrE'

function _saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function _loadFromStorage(key) {
    const val = localStorage.getItem(key)
    return JSON.parse(val)
}

async function getPhotos(searchTxt) {
    // * for dev purposes
    // return hardCodedPhotos

    // * real function
    let cachedPhotos = _loadFromStorage(STORAGE_KEY)
    if (!searchTxt && cachedPhotos) return cachedPhotos

    let URL = `https://api.unsplash.com/photos/random?count=30${
        searchTxt ? `&query=${encodeURIComponent(searchTxt)}` : ''
    }&client_id=${API_KEY}`

    try {
        const response = await axios.get(URL)
        const { data } = response
        const photos = data.map((photo) => ({
            backgroundColor: photo.color,
            background: photo.urls.full,
            thumbnail: photo.urls.small,
        }))
        _saveToStorage(STORAGE_KEY, photos)
        return photos
    } catch (err) {
        console.error('ERROR in getting photos!', err)
        // fallback to hardcoded photos if API fails
        return hardCodedPhotos
    }
}