import React, { useEffect, useState } from 'react'
import { socketService, SOCKET_EVENT_REMOTE_CURSOR, SOCKET_EVENT_REMOTE_CURSOR_LEAVE } from '../services/socket.service'

export function LiveCursors({ boardContainerRef }) {
    const [remoteCursors, setRemoteCursors] = useState({}) // { socketId: { x, y, user } }

    useEffect(() => {
        function handleRemoteCursor(data) {
            setRemoteCursors(prev => ({
                ...prev,
                [data.user.socketId]: data
            }))
        }

        function handleRemoteCursorLeave(socketId) {
            setRemoteCursors(prev => {
                const next = { ...prev }
                delete next[socketId]
                return next
            })
        }

        socketService.on(SOCKET_EVENT_REMOTE_CURSOR, handleRemoteCursor)
        socketService.on(SOCKET_EVENT_REMOTE_CURSOR_LEAVE, handleRemoteCursorLeave)

        // Throttle local mouse move
        let lastEmit = 0
        function handleMouseMove(e) {
            const now = Date.now()
            if (now - lastEmit < 40) return // ~25 fps throttle
            lastEmit = now

            if (boardContainerRef && boardContainerRef.current) {
                const rect = boardContainerRef.current.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                socketService.emitCursorMove({ x, y })
            }
        }

        const container = boardContainerRef?.current || window
        container.addEventListener('mousemove', handleMouseMove)

        return () => {
            socketService.off(SOCKET_EVENT_REMOTE_CURSOR, handleRemoteCursor)
            socketService.off(SOCKET_EVENT_REMOTE_CURSOR_LEAVE, handleRemoteCursorLeave)
            container.removeEventListener('mousemove', handleMouseMove)
        }
    }, [boardContainerRef])

    return (
        <div className="live-cursors-layer" style={{ pointerEvents: 'none', position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 9999 }}>
            {Object.entries(remoteCursors).map(([socketId, cursor]) => {
                const { x, y, user } = cursor
                const color = user?.color || '#3B82F6'
                return (
                    <div
                        key={socketId}
                        style={{
                            position: 'absolute',
                            left: `${x}px`,
                            top: `${y}px`,
                            transform: 'translate(-2px, -2px)',
                            transition: 'left 0.08s ease-out, top 0.08s ease-out',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        {/* Custom SVG pointer */}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
                            <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z" fill={color} stroke="#FFFFFF" strokeWidth="1.5" />
                        </svg>
                        <div
                            style={{
                                backgroundColor: color,
                                color: '#FFFFFF',
                                fontSize: '11px',
                                fontWeight: '600',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {user?.name || 'Peer'}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
