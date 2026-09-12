const express = require('express')
const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const {
    login,
    signup,
    googleLogin,
    forgotPassword,
    verifyOtp,
    resetPassword,
    checkAvailability,
    logout,
    demoLogin,
    getLoggedInUser
} = require('./auth.controller')

const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
router.post('/google', googleLogin)
router.post('/forgot-password', forgotPassword)
router.post('/verify-otp', verifyOtp)
router.post('/reset-password', resetPassword)
router.get('/check-availability', checkAvailability)
router.post('/demo', demoLogin)
router.post('/logout', logout)
router.get('/me', requireAuth, getLoggedInUser)

module.exports = router