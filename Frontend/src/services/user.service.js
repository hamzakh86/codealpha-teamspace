import { httpService } from './http.service'
import { socketService } from './socket.service'
import { utilService } from './util.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
    login,
    logout,
    signup,
    googleLogin,
    getLoggedinUser,
    saveLocalUser,
    getUsers,
    getById,
    remove,
    update,
    changePassword,
}

window.userService = userService

function getUsers() {
    return httpService.get(`user`)
}

async function getById(userId) {
    const user = await httpService.get(`user/${userId}`)
    return user
}

async function remove(userId) {
    await httpService.delete(`user/${userId}`)
    const localUser = getLoggedinUser()
    if (localUser && localUser._id === userId) {
        sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
        sessionStorage.removeItem('collabflow_token')
    }
}

async function update(userToSave) {
    const user = await httpService.put(`user/${userToSave._id}`, userToSave)
    const localUser = getLoggedinUser()
    if (localUser && localUser._id === user._id) {
        saveLocalUser(user)
    }
    return user
}

async function changePassword(userId, oldPassword, newPassword) {
    return await httpService.put(`user/${userId}/password`, { oldPassword, newPassword })
}

async function login(userCred) {
    console.log('user service login', userCred)
    try {
        const res = await httpService.post('auth/login', userCred)
        const user = res.user || res
        if (res.accessToken) {
            sessionStorage.setItem('collabflow_token', res.accessToken)
        }
        if (user) {
            socketService.login(user._id)
            return saveLocalUser(user)
        } else {
            throw new Error('Cannot login - No such user!')
        }
    } catch (err) {
        console.log('no such user', err)
        throw err
    }
}

async function googleLogin(googleProfile) {
    try {
        const res = await httpService.post('auth/google', googleProfile)
        const user = res.user || res
        if (res.accessToken) {
            sessionStorage.setItem('collabflow_token', res.accessToken)
        }
        if (user) {
            socketService.login(user._id)
            return saveLocalUser(user)
        } else {
            throw new Error('Connexion Google impossible')
        }
    } catch (err) {
        console.log('googleLogin error', err)
        throw err
    }
}

async function signup(userCred) {
    console.log('user service signup', userCred)
    if (!userCred.imgUrl) {
        userCred.imgUrl =
            'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    }

    const res = await httpService.post('auth/signup', userCred)
    const user = res.user || res
    if (res.accessToken) {
        sessionStorage.setItem('collabflow_token', res.accessToken)
    }
    socketService.login(user._id)
    return saveLocalUser(user)
}

async function logout() {
    try {
        await httpService.post('auth/logout')
        sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
        sessionStorage.removeItem('collabflow_token')
    } catch (err) {
        console.log('service logout error', err)
    }
    socketService.logout()
}

function saveLocalUser(user) {
    const cleanUser = {
        _id: user._id,
        fullname: user.fullname,
        imgUrl: user.imgUrl,
        username: user.username,
        email: user.email
    }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(cleanUser))
    return cleanUser
}

function getLoggedinUser() {
    return (
        JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER)) || {
            fullname: 'Guest',
            username: 'Guest',
            imgUrl:
                'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
            _id: utilService.makeId(),
        }
    )
}