const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const crypto = require('crypto')

module.exports = {
    query,
    getById,
    add,
    update,
    remove,
    addMember,
    removeMember,
    updateMemberRole,
    getStats,
    getOrCreateDefault
}

async function query(userId) {
    try {
        const collection = await dbService.getCollection('workspace')
        // Filter to only workspaces where the user is a member
        const filter = userId ? { 'members._id': String(userId) } : {}
        const workspaces = await collection.find(filter).toArray()
        return workspaces
    } catch (err) {
        logger.error('cannot find workspaces', err)
        throw err
    }
}

async function getOrCreateDefault(user) {
    try {
        if (!user || !user._id) throw new Error('User required')
        const collection = await dbService.getCollection('workspace')
        // Check if user already has a workspace
        const existing = await collection.findOne({ 'members._id': String(user._id) })
        if (existing) return existing

        // Auto-create a default personal workspace
        const firstName = (user.fullname || user.username || 'Mon').split(' ')[0]
        const workspaceToAdd = {
            _id: 'ws_' + Date.now(),
            name: `PolySpace EPS`,
            slug: 'polyspace-eps',
            description: 'Espace collaboratif officiel de l\'École Polytechnique de Sousse — Projet Hamza Khaled',
            plan: 'FREE',
            members: [
                {
                    _id: String(user._id),
                    fullname: user.fullname || user.username,
                    email: user.email || '',
                    role: 'OWNER',
                    imgUrl: user.imgUrl || ''
                }
            ],
            channels: ['polyoverflow', 'polystages-pfe', 'polyfreelance', 'polydrive-examens', 'vie-du-campus'],
            createdAt: new Date().toISOString()
        }
        await collection.insertOne(workspaceToAdd)
        logger.info(`Auto-created default workspace for user ${user._id}`)
        return workspaceToAdd
    } catch (err) {
        logger.error('cannot get or create default workspace', err)
        throw err
    }
}

async function getById(workspaceId) {
    try {
        const collection = await dbService.getCollection('workspace')
        const workspace = await collection.findOne({ _id: workspaceId })
        return workspace
    } catch (err) {
        logger.error(`while finding workspace ${workspaceId}`, err)
        throw err
    }
}

async function add(workspace, loggedinUser) {
    try {
        const workspaceToAdd = {
            _id: 'ws_' + Date.now(),
            name: workspace.name,
            slug: (workspace.name || 'workspace').toLowerCase().replace(/\s+/g, '-'),
            description: workspace.description || '',
            plan: 'FREE',
            members: [
                {
                    _id: loggedinUser?._id || 'owner_1',
                    fullname: loggedinUser?.fullname || 'Workspace Owner',
                    email: loggedinUser?.email || 'owner@collabflow.io',
                    role: 'OWNER',
                    imgUrl: loggedinUser?.imgUrl || ''
                }
            ],
            createdAt: new Date().toISOString()
        }
        const collection = await dbService.getCollection('workspace')
        await collection.insertOne(workspaceToAdd)
        return workspaceToAdd
    } catch (err) {
        logger.error('cannot insert workspace', err)
        throw err
    }
}

async function update(workspace) {
    try {
        const workspaceToSave = {
            name: workspace.name,
            description: workspace.description,
            plan: workspace.plan,
            members: workspace.members
        }
        const collection = await dbService.getCollection('workspace')
        await collection.updateOne({ _id: workspace._id }, { $set: workspaceToSave })
        return workspace
    } catch (err) {
        logger.error(`cannot update workspace ${workspace._id}`, err)
        throw err
    }
}

async function remove(workspaceId) {
    try {
        const collection = await dbService.getCollection('workspace')
        await collection.deleteOne({ _id: workspaceId })
        return workspaceId
    } catch (err) {
        logger.error(`cannot remove workspace ${workspaceId}`, err)
        throw err
    }
}

async function addMember(workspaceId, memberData) {
    try {
        const workspace = await getById(workspaceId)
        if (!workspace) throw new Error('Workspace not found')
        
        const newMember = {
            _id: memberData._id || 'user_' + Date.now(),
            fullname: memberData.fullname || memberData.email.split('@')[0],
            email: memberData.email,
            role: memberData.role || 'MEMBER',
            imgUrl: memberData.imgUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${memberData.email}`
        }
        
        workspace.members = workspace.members || []
        workspace.members.push(newMember)
        await update(workspace)
        return newMember
    } catch (err) {
        logger.error('cannot add workspace member', err)
        throw err
    }
}

async function removeMember(workspaceId, memberId) {
    try {
        const workspace = await getById(workspaceId)
        if (!workspace) throw new Error('Workspace not found')
        
        workspace.members = (workspace.members || []).filter(m => m._id !== memberId)
        await update(workspace)
        return memberId
    } catch (err) {
        logger.error('cannot remove workspace member', err)
        throw err
    }
}

async function updateMemberRole(workspaceId, memberId, newRole) {
    try {
        const workspace = await getById(workspaceId)
        if (!workspace) throw new Error('Workspace not found')
        
        const member = (workspace.members || []).find(m => m._id === memberId)
        if (member) {
            member.role = newRole
            await update(workspace)
        }
        return member
    } catch (err) {
        logger.error('cannot update workspace member role', err)
        throw err
    }
}

async function getStats(workspaceId) {
    try {
        const boardCollection = await dbService.getCollection('board')
        const allBoards = await boardCollection.find().toArray()
        
        let totalCards = 0
        let doneCards = 0
        let urgentCards = 0

        allBoards.forEach(board => {
            if (board.groups) {
                board.groups.forEach(group => {
                    if (group.tasks) {
                        totalCards += group.tasks.length
                        group.tasks.forEach(task => {
                            if (task.priority === 'URGENT' || task.priority === 'HIGH') urgentCards++
                            if (group.title.toLowerCase().includes('done') || group.title.toLowerCase().includes('terminé')) doneCards++
                        })
                    }
                })
            }
        })

        return {
            totalBoards: allBoards.length,
            totalCards,
            doneCards,
            urgentCards,
            completionRate: totalCards > 0 ? Math.round((doneCards / totalCards) * 100) : 0
        }
    } catch (err) {
        logger.error('cannot calculate workspace stats', err)
        return { totalBoards: 0, totalCards: 0, doneCards: 0, urgentCards: 0, completionRate: 0 }
    }
}
