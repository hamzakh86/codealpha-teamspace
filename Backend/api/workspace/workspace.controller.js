const workspaceService = require('./workspace.service')
const logger = require('../../services/logger.service')

module.exports = {
    getWorkspaces,
    getWorkspaceById,
    addWorkspace,
    updateWorkspace,
    removeWorkspace,
    addMember,
    removeMember,
    updateMemberRole,
    getWorkspaceStats
}

async function getWorkspaces(req, res) {
    try {
        const userId = req.loggedinUser?._id
        const workspaces = await workspaceService.query(userId)
        res.json(workspaces)
    } catch (err) {
        logger.error('Failed to get workspaces', err)
        res.status(500).send({ err: 'Failed to get workspaces' })
    }
}

async function getWorkspaceById(req, res) {
    try {
        const { id } = req.params
        const workspace = await workspaceService.getById(id)
        if (!workspace) return res.status(404).send({ err: 'Workspace not found' })
        res.json(workspace)
    } catch (err) {
        logger.error('Failed to get workspace', err)
        res.status(500).send({ err: 'Failed to get workspace' })
    }
}

async function addWorkspace(req, res) {
    try {
        const workspace = req.body
        const addedWorkspace = await workspaceService.add(workspace, req.loggedinUser)
        res.json(addedWorkspace)
    } catch (err) {
        logger.error('Failed to add workspace', err)
        res.status(500).send({ err: 'Failed to add workspace' })
    }
}

async function updateWorkspace(req, res) {
    try {
        const workspace = req.body
        const updatedWorkspace = await workspaceService.update(workspace)
        res.json(updatedWorkspace)
    } catch (err) {
        logger.error('Failed to update workspace', err)
        res.status(500).send({ err: 'Failed to update workspace' })
    }
}

async function removeWorkspace(req, res) {
    try {
        const { id } = req.params
        const removedId = await workspaceService.remove(id)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove workspace', err)
        res.status(500).send({ err: 'Failed to remove workspace' })
    }
}

async function addMember(req, res) {
    try {
        const { id } = req.params
        const member = req.body
        const addedMember = await workspaceService.addMember(id, member)
        res.json(addedMember)
    } catch (err) {
        logger.error('Failed to add workspace member', err)
        res.status(500).send({ err: 'Failed to add workspace member' })
    }
}

async function removeMember(req, res) {
    try {
        const { id, memberId } = req.params
        const removedId = await workspaceService.removeMember(id, memberId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove workspace member', err)
        res.status(500).send({ err: 'Failed to remove workspace member' })
    }
}

async function updateMemberRole(req, res) {
    try {
        const { id, memberId } = req.params
        const { role } = req.body
        const updated = await workspaceService.updateMemberRole(id, memberId, role)
        res.json(updated)
    } catch (err) {
        logger.error('Failed to update member role', err)
        res.status(500).send({ err: 'Failed to update member role' })
    }
}

async function getWorkspaceStats(req, res) {
    try {
        const { id } = req.params
        const stats = await workspaceService.getStats(id)
        res.json(stats)
    } catch (err) {
        logger.error('Failed to get workspace stats', err)
        res.status(500).send({ err: 'Failed to get workspace stats' })
    }
}
