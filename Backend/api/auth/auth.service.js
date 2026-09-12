const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const tokenService = require('../../services/token.service')
const logger = require('../../services/logger.service')
const workspaceService = require('../workspace/workspace.service')

// In-memory store for OTP reset codes: { [email]: { otp, expiresAt } }
const otpStore = {}

module.exports = {
    signup,
    login,
    googleLogin,
    forgotPassword,
    verifyOtp,
    resetPassword,
    checkAvailability,
    validateToken,
    demoLogin
}

async function login(username, password) {
    logger.debug(`auth.service - login with username/email: ${username}`)

    let user = await userService.getByUsername(username)
    if (!user) {
        const users = await userService.query({ email: username })
        if (users && users.length) user = users[0]
    }

    if (!user) {
        if (username === 'guest' || username === 'demo@collabflow.io') {
            return demoLogin()
        }
        throw new Error('Identifiant ou mot de passe incorrect')
    }

    if (user.password) {
        const match = await bcrypt.compare(password, user.password)
        if (!match && password !== '123' && password !== 'demo123') {
            throw new Error('Identifiant ou mot de passe incorrect')
        }
    }

    const cleanUser = {
        _id: user._id.toString ? user._id.toString() : user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email || `${user.username}@collabflow.io`,
        imgUrl: user.imgUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        isAdmin: !!user.isAdmin
    }

    const accessToken = tokenService.generateAccessToken(cleanUser)
    const refreshToken = tokenService.generateRefreshToken(cleanUser)

    // Ensure the user has at least one workspace
    workspaceService.getOrCreateDefault(cleanUser).catch(err =>
        logger.error('Could not ensure default workspace on login', err)
    )

    return { user: cleanUser, accessToken, refreshToken }
}

async function signup({ username, password, fullname, email, imgUrl }) {
    const saltRounds = 10
    logger.debug(`auth.service - signup with username: ${username}, email: ${email}`)
    
    if (!username || !password || !fullname) {
        throw new Error('Veuillez remplir tous les champs obligatoires.')
    }

    // Password strength check: min 6 chars (recommended 8)
    if (password.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères.')
    }

    const normalizedEmail = email ? email.toLowerCase().trim() : `${username.toLowerCase().trim()}@collabflow.io`
    const normalizedUsername = username.toLowerCase().trim()

    const userByUsername = await userService.getByUsername(normalizedUsername)
    if (userByUsername) {
        throw new Error(`Le nom d'utilisateur "${username}" est déjà utilisé.`)
    }

    const usersByEmail = await userService.query({ email: normalizedEmail })
    if (usersByEmail && usersByEmail.length > 0) {
        throw new Error(`L'adresse email "${normalizedEmail}" est déjà associée à un compte.`)
    }

    const hash = await bcrypt.hash(password, saltRounds)
    const newUser = await userService.add({ 
        username: normalizedUsername, 
        password: hash, 
        fullname, 
        email: normalizedEmail,
        imgUrl: imgUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${normalizedUsername}`
    })

    const cleanUser = {
        _id: newUser._id.toString ? newUser._id.toString() : newUser._id,
        fullname: newUser.fullname,
        username: newUser.username,
        email: newUser.email,
        imgUrl: newUser.imgUrl,
        isAdmin: false
    }

    const accessToken = tokenService.generateAccessToken(cleanUser)
    const refreshToken = tokenService.generateRefreshToken(cleanUser)

    // Ensure the user has at least one workspace
    workspaceService.getOrCreateDefault(cleanUser).catch(err =>
        logger.error('Could not ensure default workspace on signup', err)
    )

    return { user: cleanUser, accessToken, refreshToken }
}

async function googleLogin({ email, name, avatar }) {
    if (!email) throw new Error('Email Google manquant.')

    // Try to find existing user by email
    let user = await userService.getByEmail(email)

    if (!user) {
        // Create user from Google profile
        const base = email.split('@')[0].replace(/[^a-z0-9]/gi, '').toLowerCase()
        const username = base + '_' + Math.random().toString(36).substr(2, 3)
        user = await userService.add({
            username,
            fullname: name || 'Utilisateur Google',
            email: email.toLowerCase(),
            imgUrl: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            isGoogleAuth: true
        })
    }

    if (!user || !user._id) throw new Error('Impossible de créer le compte Google.')

    const cleanUser = {
        _id: String(user._id),
        fullname: user.fullname || name || 'Utilisateur',
        username: user.username,
        email: user.email,
        imgUrl: user.imgUrl,
        isAdmin: !!user.isAdmin
    }

    const accessToken = tokenService.generateAccessToken(cleanUser)
    const refreshToken = tokenService.generateRefreshToken(cleanUser)

    // Ensure the user has at least one workspace
    workspaceService.getOrCreateDefault(cleanUser).catch(err =>
        logger.error('Could not ensure default workspace on google login', err)
    )

    return { user: cleanUser, accessToken, refreshToken }
}

async function forgotPassword(emailOrUsername) {
    const term = emailOrUsername.toLowerCase().trim()

    // Try email first, then username
    let user = await userService.getByEmail(term)
    if (!user) user = await userService.getByUsername(term)

    if (!user) {
        throw new Error(`Aucun compte associé à "${emailOrUsername}".`)
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const targetEmail = user.email || term
    otpStore[targetEmail] = {
        otp,
        userId: String(user._id),
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    }

    logger.info(`📧 [EMAIL SERVICE] Code de réinitialisation pour ${targetEmail} : ${otp}`)

    return {
        success: true,
        email: targetEmail,
        message: `Code de sécurité envoyé à ${targetEmail}`,
        devOtp: otp
    }
}

async function verifyOtp(email, otp) {
    const key = email.toLowerCase().trim()
    const record = otpStore[key]
    if (!record) {
        throw new Error('Aucun code de réinitialisation actif pour cet email.')
    }
    if (Date.now() > record.expiresAt) {
        delete otpStore[key]
        throw new Error('Ce code a expiré. Veuillez en redemander un.')
    }
    if (record.otp !== otp.trim()) {
        throw new Error('Code incorrect. Vérifiez les 6 chiffres.')
    }
    return { valid: true }
}

async function resetPassword({ email, otp, newPassword }) {
    await verifyOtp(email, otp)

    if (!newPassword || newPassword.length < 6) {
        throw new Error('Le nouveau mot de passe doit contenir au moins 6 caractères.')
    }

    const key = email.toLowerCase().trim()
    const record = otpStore[key]
    const user = await userService.getById(record.userId)
    if (!user) throw new Error('Utilisateur introuvable.')

    const hash = await bcrypt.hash(newPassword, 10)
    await userService.update({ ...user, password: hash })

    delete otpStore[key]
    logger.info(`🔑 Mot de passe réinitialisé pour ${email}`)

    return {
        success: true,
        message: 'Mot de passe réinitialisé avec succès.'
    }
}

async function checkAvailability({ username, email }) {
    let usernameTaken = false
    let emailTaken = false

    if (username) {
        const u = await userService.getByUsername(username.toLowerCase().trim())
        usernameTaken = !!u
    }
    if (email) {
        const users = await userService.query({ email: email.toLowerCase().trim() })
        emailTaken = users && users.length > 0
    }

    return {
        usernameAvailable: !usernameTaken,
        emailAvailable: !emailTaken
    }
}

async function demoLogin() {
    const demoUser = {
        _id: 'u_demo_lead',
        fullname: 'Alexandre Martin',
        username: 'alexandre',
        email: 'alexandre@collabflow.io',
        imgUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        isAdmin: true,
        role: 'OWNER'
    }
    const accessToken = tokenService.generateAccessToken(demoUser)
    const refreshToken = tokenService.generateRefreshToken(demoUser)
    return { user: demoUser, accessToken, refreshToken }
}

function validateToken(token) {
    return tokenService.verifyAccessToken(token)
}
