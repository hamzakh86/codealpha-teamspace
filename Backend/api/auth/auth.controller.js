const authService = require('./auth.service')
const logger = require('../../services/logger.service')

module.exports = {
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
}

async function login(req, res) {
    const { username, password } = req.body
    try {
        const { user, accessToken, refreshToken } = await authService.login(username, password)
        res.cookie('loginToken', accessToken, { httpOnly: true, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000 })
        res.json({ user, accessToken, refreshToken })
    } catch (err) {
        logger.error('Failed to Login ' + err)
        res.status(401).send({ err: err.message || 'Failed to Login' })
    }
}

async function signup(req, res) {
    try {
        const credentials = req.body
        const { user, accessToken, refreshToken } = await authService.signup(credentials)
        res.cookie('loginToken', accessToken, { httpOnly: true, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000 })
        res.json({ user, accessToken, refreshToken })
    } catch (err) {
        logger.error('Failed to signup ' + err)
        res.status(400).send({ err: err.message || 'Failed to signup' })
    }
}

async function googleLogin(req, res) {
    try {
        const profile = req.body
        const { user, accessToken, refreshToken } = await authService.googleLogin(profile)
        res.cookie('loginToken', accessToken, { httpOnly: true, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000 })
        res.json({ user, accessToken, refreshToken })
    } catch (err) {
        logger.error('Failed to google login ' + err)
        res.status(400).send({ err: err.message || 'Failed to google login' })
    }
}

async function forgotPassword(req, res) {
    try {
        const { email } = req.body
        const result = await authService.forgotPassword(email)
        res.json(result)
    } catch (err) {
        logger.error('Forgot password error: ' + err)
        res.status(400).send({ err: err.message || 'Erreur lors de la demande de réinitialisation' })
    }
}

async function verifyOtp(req, res) {
    try {
        const { email, otp } = req.body
        const result = await authService.verifyOtp(email, otp)
        res.json(result)
    } catch (err) {
        logger.error('Verify OTP error: ' + err)
        res.status(400).send({ err: err.message || 'Code de vérification invalide' })
    }
}

async function resetPassword(req, res) {
    try {
        const { email, otp, newPassword } = req.body
        const result = await authService.resetPassword({ email, otp, newPassword })
        res.json(result)
    } catch (err) {
        logger.error('Reset password error: ' + err)
        res.status(400).send({ err: err.message || 'Erreur lors de la réinitialisation du mot de passe' })
    }
}

async function checkAvailability(req, res) {
    try {
        const { username, email } = req.query
        const result = await authService.checkAvailability({ username, email })
        res.json(result)
    } catch (err) {
        res.status(400).send({ err: err.message })
    }
}

async function demoLogin(req, res) {
    try {
        const { user, accessToken, refreshToken } = await authService.demoLogin()
        res.cookie('loginToken', accessToken, { httpOnly: true, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000 })
        res.json({ user, accessToken, refreshToken })
    } catch (err) {
        logger.error('Failed to demo login ' + err)
        res.status(500).send({ err: 'Failed to demo login' })
    }
}

async function logout(req, res) {
    try {
        res.clearCookie('loginToken')
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        res.status(500).send({ err: 'Failed to logout' })
    }
}

async function getLoggedInUser(req, res) {
    try {
        if (req.loggedinUser) {
            res.json(req.loggedinUser)
        } else {
            res.status(401).send({ err: 'Not logged in' })
        }
    } catch (err) {
        res.status(500).send({ err: 'Failed to get current user' })
    }
}
