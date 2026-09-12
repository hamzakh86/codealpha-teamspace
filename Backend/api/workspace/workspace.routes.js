const express = require('express')
const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const {
    getWorkspaces,
    getWorkspaceById,
    addWorkspace,
    updateWorkspace,
    removeWorkspace,
    addMember,
    removeMember,
    updateMemberRole,
    getWorkspaceStats
} = require('./workspace.controller')

const router = express.Router()

router.get('/', requireAuth, getWorkspaces)
router.get('/:id', requireAuth, getWorkspaceById)
router.get('/:id/stats', requireAuth, getWorkspaceStats)
router.post('/', requireAuth, addWorkspace)
router.put('/:id', requireAuth, updateWorkspace)
router.delete('/:id', requireAuth, removeWorkspace)

router.post('/:id/member', requireAuth, addMember)
router.delete('/:id/member/:memberId', requireAuth, removeMember)
router.put('/:id/member/:memberId/role', requireAuth, updateMemberRole)

module.exports = router
