const jwt = require('jsonwebtoken')
const config = require('../config')

function generateAccessToken(user) {
    const payload = {
        _id: user._id || user.id,
        email: user.email || user.username,
        fullname: user.fullname,
        imgUrl: user.imgUrl,
        isAdmin: !!user.isAdmin
    }
    return jwt.sign(payload, config.jwtSecret, { expiresIn: '1d' })
}

function generateRefreshToken(user) {
    const payload = {
        _id: user._id || user.id
    }
    return jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: '7d' })
}

function verifyAccessToken(token) {
    try {
        return jwt.verify(token, config.jwtSecret)
    } catch (err) {
        return null
    }
}

function verifyRefreshToken(token) {
    try {
        return jwt.verify(token, config.jwtRefreshSecret)
    } catch (err) {
        return null
    }
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}
