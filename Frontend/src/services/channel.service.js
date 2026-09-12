import { httpService } from './http.service'

const CHANNEL_API = 'channel'

export const channelService = {
    /**
     * Load message history for a given channel name
     * GET /api/channel/:channelName/messages
     */
    async getMessages(channelName, limit = 50) {
        return httpService.get(`${CHANNEL_API}/${encodeURIComponent(channelName)}/messages?limit=${limit}`)
    },

    /**
     * Post a new message (REST fallback - normally done via socket)
     * POST /api/channel/:channelName/messages
     */
    async postMessage(channelName, txt, attachment = null) {
        return httpService.post(`${CHANNEL_API}/${encodeURIComponent(channelName)}/messages`, { txt, attachment })
    },

    /**
     * Toggle reaction on a message
     * POST /api/channel/:channelName/messages/:msgId/reaction
     */
    async toggleReaction(channelName, msgId, emoji, user = null) {
        return httpService.post(`${CHANNEL_API}/${encodeURIComponent(channelName)}/messages/${msgId}/reaction`, { emoji, user })
    },

    /**
     * Toggle pin status on a message
     * POST /api/channel/:channelName/messages/:msgId/pin
     */
    async togglePin(channelName, msgId) {
        return httpService.post(`${CHANNEL_API}/${encodeURIComponent(channelName)}/messages/${msgId}/pin`)
    }
}

