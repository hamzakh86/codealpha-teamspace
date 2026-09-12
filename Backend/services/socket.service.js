const logger = require('./logger.service')

let gIo = null
const activeBoardUsers = {} // { boardId: [ { userId, name, imgUrl, socketId, color } ] }

const CURSOR_COLORS = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'
]

function setupSocketAPI(http) {
    gIo = require('socket.io')(http, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        },
    })

    gIo.on('connection', (socket) => {
        logger.info(`⚡ Socket connected: [id: ${socket.id}]`)

        // Join a specific Board room
        socket.on('join-board', ({ boardId, user }) => {
            if (socket.myBoardId) {
                socket.leave(`board:${socket.myBoardId}`)
                _removeUserFromBoard(socket.myBoardId, socket.id)
            }

            socket.myBoardId = boardId
            socket.join(`board:${boardId}`)
            
            if (user) {
                socket.userInfo = {
                    userId: user._id || user.id || socket.id,
                    name: user.fullname || user.name || 'Anonymous',
                    imgUrl: user.imgUrl || '',
                    socketId: socket.id,
                    color: CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)]
                }
                _addUserToBoard(boardId, socket.userInfo)
            }

            logger.info(`Socket [${socket.id}] joined board:${boardId}`)
            // Broadcast updated active presence
            gIo.to(`board:${boardId}`).emit('board-presence', activeBoardUsers[boardId] || [])
        })

        // Live Multiplayer Cursor Move
        socket.on('cursor-move', (pos) => {
            if (!socket.myBoardId || !socket.userInfo) return
            socket.to(`board:${socket.myBoardId}`).emit('remote-cursor-move', {
                ...pos,
                user: socket.userInfo
            })
        })

        // Real-time Board Update (Drag and Drop / Task edit)
        socket.on('update-board', (board) => {
            if (!socket.myBoardId) return
            logger.info(`Board update on board:${socket.myBoardId}`)
            socket.to(`board:${socket.myBoardId}`).emit('update-board', board)
        })

        // Real-time Card Dragged
        socket.on('card-dragged', (dragData) => {
            if (!socket.myBoardId) return
            socket.to(`board:${socket.myBoardId}`).emit('card-dragged', dragData)
        })

        // Live Board & Channel Chat Message
        socket.on('chat-send-msg', (msg) => {
            if (!socket.myBoardId) return
            const messageWithMeta = {
                ...msg,
                id: 'msg_' + Date.now(),
                timestamp: new Date().toISOString(),
                sender: socket.userInfo || { name: 'Collaborator' }
            }
            gIo.to(`board:${socket.myBoardId}`).emit('chat-add-msg', messageWithMeta)
        })

        // Typing Indicator
        socket.on('typing', (isTyping) => {
            if (!socket.myBoardId || !socket.userInfo) return
            socket.to(`board:${socket.myBoardId}`).emit('user-typing', {
                user: socket.userInfo,
                isTyping
            })
        })

        // ── PolySpace Salon (Channel) Events ─────────────────────────
        // Join a named channel room (e.g. "polyoverflow")
        socket.on('join-channel', ({ channelName, user }) => {
            // Leave previous channel room if any
            if (socket.myChannelName) {
                socket.leave(`channel:${socket.myChannelName}`)
            }
            socket.myChannelName = channelName
            socket.channelUser = user || socket.userInfo || { name: 'Étudiant EPS' }
            socket.join(`channel:${channelName}`)
            logger.info(`Socket [${socket.id}] joined channel:${channelName}`)
        })

        // Send message to channel room + persist via channelService
        socket.on('channel-send-msg', async ({ channelName, txt }) => {
            if (!channelName || !txt || !txt.trim()) return
            try {
                const channelService = require('../api/channel/channel.service')
                const sender = socket.channelUser || socket.userInfo || { name: 'Étudiant EPS' }
                const saved = await channelService.addMessage(channelName, {
                    from: sender.fullname || sender.name || 'Étudiant EPS',
                    fromId: sender._id || sender.userId || null,
                    imgUrl: sender.imgUrl || '',
                    txt: txt.trim()
                })
                // Broadcast to everyone in the channel (including sender)
                gIo.to(`channel:${channelName}`).emit('channel-add-msg', saved)
            } catch (err) {
                logger.error('channel-send-msg error', err)
            }
        })

        // Channel typing indicator
        socket.on('channel-typing', ({ channelName, isTyping }) => {
            if (!channelName) return
            const sender = socket.channelUser || socket.userInfo || { name: 'Étudiant EPS' }
            socket.to(`channel:${channelName}`).emit('channel-user-typing', {
                user: sender,
                isTyping,
                channelName
            })
        })

        // Channel message reaction toggle
        socket.on('channel-react-msg', async ({ channelName, msgId, emoji }) => {
            if (!channelName || !msgId || !emoji) return
            try {
                const channelService = require('../api/channel/channel.service')
                const sender = socket.channelUser || socket.userInfo || { name: 'Étudiant EPS' }
                const userIdentifier = sender.fullname || sender.name || 'Étudiant EPS'
                const updatedMsg = await channelService.toggleReaction(channelName, msgId, emoji, userIdentifier)
                if (updatedMsg) {
                    gIo.to(`channel:${channelName}`).emit('channel-msg-reacted', {
                        channelName,
                        msgId,
                        reactions: updatedMsg.reactions,
                        updatedMsg
                    })
                }
            } catch (err) {
                logger.error('channel-react-msg error', err)
            }
        })

        // Channel message pin toggle
        socket.on('channel-pin-msg', async ({ channelName, msgId }) => {
            if (!channelName || !msgId) return
            try {
                const channelService = require('../api/channel/channel.service')
                const updatedMsg = await channelService.togglePin(channelName, msgId)
                if (updatedMsg) {
                    gIo.to(`channel:${channelName}`).emit('channel-msg-pinned', {
                        channelName,
                        msgId,
                        isPinned: updatedMsg.isPinned,
                        updatedMsg
                    })
                }
            } catch (err) {
                logger.error('channel-pin-msg error', err)
            }
        })

        // ── Voice Huddle Room Events (Discord style) ───────────────────
        socket.on('voice-join', ({ channelName, user }) => {
            const voiceUser = user || socket.channelUser || { name: 'Étudiant EPS' }
            socket.voiceChannel = channelName
            socket.join(`voice:${channelName}`)
            socket.to(`voice:${channelName}`).emit('voice-user-joined', voiceUser)
            logger.info(`User ${voiceUser.fullname || voiceUser.name} joined voice:${channelName}`)
        })

        socket.on('voice-leave', ({ channelName, user }) => {
            const voiceUser = user || socket.channelUser || { name: 'Étudiant EPS' }
            socket.leave(`voice:${channelName}`)
            socket.to(`voice:${channelName}`).emit('voice-user-left', voiceUser)
        })

        socket.on('voice-state', ({ channelName, user, isMuted, isDeafened, isScreenSharing }) => {
            socket.to(`voice:${channelName}`).emit('voice-state-update', {
                user,
                isMuted,
                isDeafened,
                isScreenSharing
            })
        })

        // Disconnect cleanup
        socket.on('disconnect', () => {
            logger.info(`Socket disconnected: [id: ${socket.id}]`)
            if (socket.myBoardId) {
                _removeUserFromBoard(socket.myBoardId, socket.id)
                gIo.to(`board:${socket.myBoardId}`).emit('board-presence', activeBoardUsers[socket.myBoardId] || [])
                socket.to(`board:${socket.myBoardId}`).emit('remote-cursor-leave', socket.id)
            }
        })
    })
}

function _addUserToBoard(boardId, userInfo) {
    if (!activeBoardUsers[boardId]) activeBoardUsers[boardId] = []
    const existingIdx = activeBoardUsers[boardId].findIndex(u => u.userId === userInfo.userId || u.socketId === userInfo.socketId)
    if (existingIdx !== -1) {
        activeBoardUsers[boardId][existingIdx] = userInfo
    } else {
        activeBoardUsers[boardId].push(userInfo)
    }
}

function _removeUserFromBoard(boardId, socketId) {
    if (!activeBoardUsers[boardId]) return
    activeBoardUsers[boardId] = activeBoardUsers[boardId].filter(u => u.socketId !== socketId)
    if (activeBoardUsers[boardId].length === 0) {
        delete activeBoardUsers[boardId]
    }
}

function emitToBoard(boardId, type, data) {
    if (gIo) gIo.to(`board:${boardId}`).emit(type, data)
}

module.exports = {
    setupSocketAPI,
    emitToBoard
}
