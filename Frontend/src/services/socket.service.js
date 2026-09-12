import io from 'socket.io-client'
import { userService } from './user.service'

export const SOCKET_EMIT_JOIN_BOARD = 'join-board'
export const SOCKET_EVENT_UPDATE_BOARD = 'update-board'
export const SOCKET_EVENT_BOARD_PRESENCE = 'board-presence'
export const SOCKET_EMIT_CURSOR_MOVE = 'cursor-move'
export const SOCKET_EVENT_REMOTE_CURSOR = 'remote-cursor-move'
export const SOCKET_EVENT_REMOTE_CURSOR_LEAVE = 'remote-cursor-leave'

export const SOCKET_EVENT_ADD_MSG = 'chat-add-msg'
export const SOCKET_EMIT_SEND_MSG = 'chat-send-msg'
export const SOCKET_EVENT_TYPING = 'user-typing'
export const SOCKET_EMIT_TYPING = 'typing'

// ── PolySpace Channel (Salon) Events ─────────────────────────
export const SOCKET_EMIT_JOIN_CHANNEL = 'join-channel'
export const SOCKET_EMIT_CHANNEL_MSG = 'channel-send-msg'
export const SOCKET_EVENT_CHANNEL_MSG = 'channel-add-msg'
export const SOCKET_EMIT_CHANNEL_TYPING = 'channel-typing'
export const SOCKET_EVENT_CHANNEL_TYPING = 'channel-user-typing'
export const SOCKET_EMIT_CHANNEL_REACT = 'channel-react-msg'
export const SOCKET_EVENT_CHANNEL_REACTED = 'channel-msg-reacted'
export const SOCKET_EMIT_CHANNEL_PIN = 'channel-pin-msg'
export const SOCKET_EVENT_CHANNEL_PINNED = 'channel-msg-pinned'

// Voice Huddle Events
export const SOCKET_EMIT_VOICE_JOIN = 'voice-join'
export const SOCKET_EMIT_VOICE_LEAVE = 'voice-leave'
export const SOCKET_EMIT_VOICE_STATE = 'voice-state'
export const SOCKET_EVENT_VOICE_JOINED = 'voice-user-joined'
export const SOCKET_EVENT_VOICE_LEFT = 'voice-user-left'
export const SOCKET_EVENT_VOICE_STATE = 'voice-state-update'

const baseUrl = process.env.NODE_ENV === 'production' ? '' : '//localhost:3030'
export const socketService = createSocketService()


window.socketService = socketService
socketService.setup()

function createSocketService() {
    let socket = null
    const socketService = {
        setup() {
            socket = io(baseUrl)
        },
        login(userId) {
            if (!socket) return
            socket.emit('set-user-socket', userId)
        },
        logout() {
            if (!socket) return
            socket.emit('unset-user-socket')
        },
        joinBoard(boardId) {
            if (!socket) return
            const user = userService.getLoggedinUser() || { fullname: 'Guest Collaborator', _id: 'guest_' + Math.random().toString(36).substr(2, 4) }
            socket.emit(SOCKET_EMIT_JOIN_BOARD, { boardId, user })
        },
        emitCursorMove(pos) {
            if (!socket) return
            socket.emit(SOCKET_EMIT_CURSOR_MOVE, pos)
        },
        sendChatMessage(txt) {
            if (!socket) return
            const user = userService.getLoggedinUser() || { fullname: 'Collaborator' }
            socket.emit(SOCKET_EMIT_SEND_MSG, { txt, from: user.fullname })
        },
        sendTyping(isTyping) {
            if (!socket) return
            socket.emit(SOCKET_EMIT_TYPING, isTyping)
        },
        // ── Channel (Salon) methods ───────────────────────────────────
        joinChannel(channelName) {
            if (!socket) return
            const user = userService.getLoggedinUser() || { fullname: 'Étudiant EPS' }
            socket.emit(SOCKET_EMIT_JOIN_CHANNEL, { channelName, user })
        },
        sendChannelMessage(channelName, txt) {
            if (!socket) return
            socket.emit(SOCKET_EMIT_CHANNEL_MSG, { channelName, txt })
        },
        sendChannelTyping(channelName, isTyping) {
            if (!socket) return
            socket.emit(SOCKET_EMIT_CHANNEL_TYPING, { channelName, isTyping })
        },
        sendChannelReaction(channelName, msgId, emoji) {
            if (!socket) return
            socket.emit(SOCKET_EMIT_CHANNEL_REACT, { channelName, msgId, emoji })
        },
        sendChannelPin(channelName, msgId) {
            if (!socket) return
            socket.emit(SOCKET_EMIT_CHANNEL_PIN, { channelName, msgId })
        },
        joinVoice(channelName) {
            if (!socket) return
            const user = userService.getLoggedinUser() || { fullname: 'Étudiant EPS' }
            socket.emit(SOCKET_EMIT_VOICE_JOIN, { channelName, user })
        },
        leaveVoice(channelName) {
            if (!socket) return
            const user = userService.getLoggedinUser() || { fullname: 'Étudiant EPS' }
            socket.emit(SOCKET_EMIT_VOICE_LEAVE, { channelName, user })
        },
        updateVoiceState(channelName, state) {
            if (!socket) return
            const user = userService.getLoggedinUser() || { fullname: 'Étudiant EPS' }
            socket.emit(SOCKET_EMIT_VOICE_STATE, { channelName, user, ...state })
        },
        on(eventName, cb) {
            if (!socket) return
            socket.on(eventName, cb)
        },
        off(eventName, cb = null) {
            if (!socket) return
            if (!cb) socket.removeAllListeners(eventName)
            else socket.off(eventName, cb)
        },
        emit(eventName, data) {
            if (!socket) return
            socket.emit(eventName, data)
        },
        terminate() {
            if (socket) socket.disconnect()
            socket = null
        }
    }
    return socketService
}
