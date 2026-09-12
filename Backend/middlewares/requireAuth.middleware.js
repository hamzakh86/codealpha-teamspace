const tokenService = require('../services/token.service')
const logger = require('../services/logger.service')
const config = require('../config')
const asyncLocalStorage = require('../services/als.service')

function requireAuth(req, res, next) {
    let token = null
    const authHeader = req.headers['authorization']
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1]
    } else if (req.cookies && req.cookies.loginToken) {
        token = req.cookies.loginToken
    }

    if (token) {
        const decoded = tokenService.verifyAccessToken(token)
        if (decoded) {
            req.loggedinUser = decoded
            return next()
        }
    }

    // Check ALS store if set by middleware
    const alsStore = asyncLocalStorage.getStore()
    if (alsStore && alsStore.loggedinUser) {
        req.loggedinUser = alsStore.loggedinUser
        return next()
    }

    if (config.isGuestMode) {
        req.loggedinUser = {
            _id: 'guest_user_id',
            fullname: 'Guest User',
            username: 'guest',
            isAdmin: false,
            role: 'MEMBER'
        }
        return next()
    }

    return res.status(401).json({ error: 'Authentication required. Invalid or expired token.' })
}

function requireAdmin(req, res, next) {
    requireAuth(req, res, () => {
        if (!req.loggedinUser || !req.loggedinUser.isAdmin) {
            logger.warn(`User ${req.loggedinUser?.fullname || 'Unknown'} attempted admin action without permissions`)
            return res.status(403).json({ error: 'Forbidden: Admin privilege required' })
        }
        next()
    })
}

function requireRole(allowedRoles = ['OWNER', 'ADMIN', 'MEMBER']) {
    return (req, res, next) => {
        requireAuth(req, res, () => {
            const userRole = req.loggedinUser?.role || 'MEMBER'
            if (!allowedRoles.includes(userRole) && !req.loggedinUser?.isAdmin) {
                return res.status(403).json({ error: `Forbidden: Requires one of [${allowedRoles.join(', ')}] role` })
            }
            next()
        })
    }
}

module.exports = {
    requireAuth,
    requireAdmin,
    requireRole
}
