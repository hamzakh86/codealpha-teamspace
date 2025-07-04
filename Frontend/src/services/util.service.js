export const utilService = {
    findDataById,
    dueDateTimeFormat,
    dueDateFormat,
    makeId,
    makeLorem,
    getRandomIntInclusive,
    debounce,
    randomPastTime,
    saveToStorage,
    loadFromStorage,
    randomFutureTime,
    timeSince
}

function findDataById(ids, board, type) {
    if (!ids || !board || !board[type]) return []
    let currType = board[type]
    let fullData = []
    ids.forEach((id) => {
        if (type === 'members') {
            const found = currType.find((t) => t._id === id)
            if (found) fullData.push(found)
        } else if (type === 'labels') {
            const found = currType.find((t) => t.id === id)
            if (found) fullData.push(found)
        }
    })
    return fullData
}

function dueDateTimeFormat(dueDate) {
    const currYear = new Date().getFullYear()
    const dueYear = new Date(dueDate).getFullYear()
    let strDate = ''
    strDate += `${new Date(dueDate).toLocaleString('en-US', { day: 'numeric' })} `
    strDate += `${new Date(dueDate).toLocaleString('en-US', {
        month: 'short',
    })} at `
    if (dueYear !== currYear) {
        strDate += `${dueYear} `
    }
    strDate += `${new Date(dueDate)
        .toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        })
        .toLocaleUpperCase()}`
    return strDate
}

function dueDateFormat(dueDate) {
    let strDate = ''
    strDate += `${new Date(dueDate).toLocaleString('en-US', { day: 'numeric' })} `
    strDate += `${new Date(dueDate).toLocaleString('en-US', { month: 'short' })}`
    return strDate
}

function makeId(length = 6) {
    var txt = ''
    var possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function makeLorem(size = 100) {
    var words = [
        'The sky',
        'above',
        'the port',
        'was',
        'the color of television',
        'tuned',
        'to',
        'a dead channel',
        '.',
        'All',
        'this happened',
        'more or less',
        '.',
        'I',
        'had',
        'the story',
        'bit by bit',
        'from various people',
        'and',
        'as generally',
        'happens',
        'in such cases',
        'each time',
        'it',
        'was',
        'a different story',
        '.',
        'It',
        'was',
        'a pleasure',
        'to',
        'burn',
    ]
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
}

function randomPastTime() {
    const HOUR = 1000 * 60 * 60
    // const DAY = 1000 * 60 * 60 * 24 // <-- Remove unused variable
    const WEEK = 1000 * 60 * 60 * 24 * 7

    const pastTime = getRandomIntInclusive(HOUR, WEEK)
    return Date.now() - pastTime
}

function randomFutureTime() {
    const HOUR = 1000 * 60 * 60
    // const DAY = 1000 * 60 * 60 * 24 // <-- Remove unused variable
    const WEEK = 1000 * 60 * 60 * 24 * 7

    const pastTime = getRandomIntInclusive(HOUR, WEEK)
    return Date.now() + pastTime
}

function debounce(func, timeout = 300) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(this, args)
        }, timeout)
    }
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : undefined
}

function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000)

    var interval = seconds / 31536000

    if (interval > 1) {
        if (Math.floor(interval) === 1) return 'a year ago'
        return Math.floor(interval) + ' years ago'
    }
    interval = seconds / 2592000
    if (interval > 1) {
        if (Math.floor(interval) === 1) return 'a month ago'
        return Math.floor(interval) + ' months ago'
    }
    interval = seconds / 86400
    if (interval > 1) {
        if (Math.floor(interval) === 1) return 'a day ago'
        return Math.floor(interval) + ' days ago'
    }
    interval = seconds / 3600
    if (interval > 1) {
        if (Math.floor(interval) === 1) return 'an hour ago'
        return Math.floor(interval) + ' hours ago'
    }
    interval = seconds / 60
    if (interval > 1) {
        if (Math.floor(interval) === 1) return 'Just now'
        return Math.floor(interval) + ' minutes ago'
    }
    if (Math.floor(seconds) === 0) return 'Just now'
    return Math.floor(seconds) + ' seconds ago'
}