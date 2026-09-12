import { httpService } from './http.service'

export const workspaceService = {
    query,
    getById,
    save,
    remove,
    addMember,
    removeMember,
    updateMemberRole,
    getStats
}

async function query() {
    return httpService.get('workspace')
}

async function getById(workspaceId) {
    return httpService.get(`workspace/${workspaceId}`)
}

async function save(workspace) {
    if (workspace._id) {
        return httpService.put(`workspace/${workspace._id}`, workspace)
    } else {
        return httpService.post('workspace', workspace)
    }
}

async function remove(workspaceId) {
    return httpService.delete(`workspace/${workspaceId}`)
}

async function addMember(workspaceId, memberData) {
    return httpService.post(`workspace/${workspaceId}/member`, memberData)
}

async function removeMember(workspaceId, memberId) {
    return httpService.delete(`workspace/${workspaceId}/member/${memberId}`)
}

async function updateMemberRole(workspaceId, memberId, role) {
    return httpService.put(`workspace/${workspaceId}/member/${memberId}/role`, { role })
}

async function getStats(workspaceId) {
    return httpService.get(`workspace/${workspaceId}/stats`)
}
