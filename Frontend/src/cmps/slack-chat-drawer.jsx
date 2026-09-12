import React, { useState, useEffect, useRef } from 'react'
import {
    socketService,
    SOCKET_EVENT_CHANNEL_MSG,
    SOCKET_EVENT_CHANNEL_TYPING,
    SOCKET_EVENT_CHANNEL_REACTED,
    SOCKET_EVENT_CHANNEL_PINNED
} from '../services/socket.service'
import { channelService } from '../services/channel.service'
import { userService } from '../services/user.service'
import {
    IoClose,
    IoSend,
} from 'react-icons/io5'
import {
    HiAcademicCap,
    HiQuestionMarkCircle,
    HiBriefcase,
    HiDocumentArrowDown,
    HiCurrencyDollar,
    HiChatBubbleLeftRight,
    HiOutlineBookmark,
    HiOutlineMagnifyingGlass,
    HiOutlineXMark,
    HiOutlinePaperClip,
    HiOutlineMicrophone,
    HiOutlineSpeakerWave,
    HiOutlineComputerDesktop,
    HiOutlineDocumentText,
    HiOutlineArrowDownTray
} from 'react-icons/hi2'

// ── Channel metadata for PolySpace EPS ──────────────────────────
const CHANNEL_META = {
    'polyoverflow': {
        icon: <HiQuestionMarkCircle />,
        color: '#38BDF8',
        desc: 'Forum Q&R — Code, Maths, Physique, Algo',
        welcome: 'Bienvenue sur PolyOverflow ! Posez vos questions techniques et académiques.'
    },
    'polystages-pfe': {
        icon: <HiBriefcase />,
        color: '#F58220',
        desc: 'Offres de stages, PFA et PFE vérifiées à Sousse',
        welcome: 'Bienvenue sur PolyStages & PFE ! Partagez et découvrez des opportunités de stages.'
    },
    'polyfreelance': {
        icon: <HiCurrencyDollar />,
        color: '#10B981',
        desc: 'Missions rémunérées & projets tech étudiants',
        welcome: 'Bienvenue sur PolyFreelance ! Proposez et trouvez des missions freelance.'
    },
    'polydrive-examens': {
        icon: <HiDocumentArrowDown />,
        color: '#A78BFA',
        desc: 'Annales, DS corrigés & résumés de cours',
        welcome: 'Bienvenue sur PolyDrive ! Partagez et téléchargez des ressources pédagogiques.'
    },
    'vie-du-campus': {
        icon: <HiAcademicCap />,
        color: '#F59E0B',
        desc: 'Actualités, clubs, événements EPS',
        welcome: 'Bienvenue sur Vie du Campus ! Partagez l\'actualité de l\'École Polytechnique de Sousse.'
    }
}

const DEFAULT_META = {
    icon: <HiChatBubbleLeftRight />,
    color: '#38BDF8',
    desc: 'Canal de discussion',
    welcome: 'Bienvenue sur ce canal !'
}

// Preset EPS Exam Annales & Resources for PolyDrive Sharing
const PRESET_ATTACHMENTS = [
    { name: 'DS_Algorithmique_Arbres_2024.pdf', size: '1.4 Mo', type: 'pdf' },
    { name: 'PFE_Cahier_des_Charges_EPS.docx', size: '840 Ko', type: 'docx' },
    { name: 'Resume_Algebre_Lineaire_Prepa2.pdf', size: '2.8 Mo', type: 'pdf' },
    { name: 'TP_Robotique_STM32_FreeRTOS.zip', size: '4.1 Mo', type: 'zip' }
]

const QUICK_EMOJIS = ['👍', '❤️', '🚀', '🔥', '💡', '🎓']

export function SlackChatDrawer({ isOpen, onClose, channel = 'polyoverflow' }) {
    const [messages, setMessages] = useState([])
    const [newMsg, setNewMsg] = useState('')
    const [typingUser, setTypingUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    // Discord / Slack Supercharge states
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isPinnedPanelOpen, setIsPinnedPanelOpen] = useState(false)
    const [activeHoverMsgId, setActiveHoverMsgId] = useState(null)
    const [pendingAttachment, setPendingAttachment] = useState(null)
    const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false)

    // Discord-Style Voice Huddle Room states
    const [isVoiceConnected, setIsVoiceConnected] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [isScreenSharing, setIsScreenSharing] = useState(false)

    const messagesEndRef = useRef(null)
    const typingTimeoutRef = useRef(null)
    const loggedinUser = userService.getLoggedinUser() || { fullname: 'Étudiant EPS', _id: 'guest' }

    const meta = CHANNEL_META[channel] || DEFAULT_META

    // Load message history from API when channel changes
    useEffect(() => {
        if (!isOpen) return
        setIsLoading(true)
        setError(null)
        setMessages([])
        setSearchQuery('')
        setIsSearchOpen(false)
        setIsPinnedPanelOpen(false)

        channelService.getMessages(channel, 50)
            .then(history => {
                setMessages(history || [])
                setIsLoading(false)
            })
            .catch(err => {
                console.error(`Failed to load #${channel} history:`, err)
                setError('Impossible de charger l\'historique.')
                setIsLoading(false)
            })
    }, [channel, isOpen])

    // Join socket channel room and listen for real-time messages & reactions
    useEffect(() => {
        if (!isOpen) return

        socketService.joinChannel(channel)

        function handleChannelMsg(msg) {
            if (!msg.channel || msg.channel === channel) {
                setMessages(prev => {
                    const exists = prev.some(m => m._id === msg._id)
                    return exists ? prev : [...prev, msg]
                })
            }
        }

        function handleTyping({ user, isTyping, channelName }) {
            if (channelName !== channel) return
            const name = (user && (user.fullname || user.name)) || 'Un étudiant'
            if (isTyping && name !== loggedinUser.fullname) {
                setTypingUser(name)
            } else {
                setTypingUser(null)
            }
        }

        function handleReactionUpdate({ channelName, msgId, reactions }) {
            if (channelName !== channel) return
            setMessages(prev => prev.map(m => m._id === msgId ? { ...m, reactions } : m))
        }

        function handlePinUpdate({ channelName, msgId, isPinned }) {
            if (channelName !== channel) return
            setMessages(prev => prev.map(m => m._id === msgId ? { ...m, isPinned } : m))
        }

        socketService.on(SOCKET_EVENT_CHANNEL_MSG, handleChannelMsg)
        socketService.on(SOCKET_EVENT_CHANNEL_TYPING, handleTyping)
        socketService.on(SOCKET_EVENT_CHANNEL_REACTED, handleReactionUpdate)
        socketService.on(SOCKET_EVENT_CHANNEL_PINNED, handlePinUpdate)

        return () => {
            socketService.off(SOCKET_EVENT_CHANNEL_MSG, handleChannelMsg)
            socketService.off(SOCKET_EVENT_CHANNEL_TYPING, handleTyping)
            socketService.off(SOCKET_EVENT_CHANNEL_REACTED, handleReactionUpdate)
            socketService.off(SOCKET_EVENT_CHANNEL_PINNED, handlePinUpdate)
        }
    }, [channel, isOpen, loggedinUser.fullname])

    // Auto-scroll to latest message
    useEffect(() => {
        if (messagesEndRef.current && !isPinnedPanelOpen && !searchQuery) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, isPinnedPanelOpen, searchQuery])

    if (!isOpen) return null

    function handleSend(e) {
        e.preventDefault()
        if (!newMsg.trim() && !pendingAttachment) return

        const txtToSend = newMsg.trim() || (pendingAttachment ? `A partagé un document : ${pendingAttachment.name}` : '')

        // If attachment present, use REST post, otherwise socket
        if (pendingAttachment) {
            channelService.postMessage(channel, txtToSend, pendingAttachment)
                .then(saved => {
                    setMessages(prev => [...prev, saved])
                })
                .catch(console.error)
        } else {
            socketService.sendChannelMessage(channel, txtToSend)
        }

        socketService.sendChannelTyping(channel, false)
        setNewMsg('')
        setPendingAttachment(null)
        setIsAttachMenuOpen(false)

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    }

    function handleInputChange(e) {
        setNewMsg(e.target.value)
        socketService.sendChannelTyping(channel, e.target.value.length > 0)
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = setTimeout(() => {
            socketService.sendChannelTyping(channel, false)
        }, 2500)
    }

    // Toggle reaction on a message
    function onToggleReaction(msgId, emoji) {
        const userIdentifier = loggedinUser.fullname || 'Étudiant EPS'
        // Optimistic local update
        setMessages(prev => prev.map(m => {
            if (m._id !== msgId) return m
            const reactions = { ...(m.reactions || {}) }
            const users = reactions[emoji] ? [...reactions[emoji]] : []
            const idx = users.indexOf(userIdentifier)
            if (idx !== -1) {
                users.splice(idx, 1)
                if (users.length === 0) delete reactions[emoji]
                else reactions[emoji] = users
            } else {
                users.push(userIdentifier)
                reactions[emoji] = users
            }
            return { ...m, reactions }
        }))

        // Sync with backend & socket
        socketService.sendChannelReaction(channel, msgId, emoji)
        channelService.toggleReaction(channel, msgId, emoji, userIdentifier).catch(console.error)
    }

    // Toggle pinned status on a message
    function onTogglePin(msgId) {
        setMessages(prev => prev.map(m => {
            if (m._id !== msgId) return m
            return { ...m, isPinned: !m.isPinned }
        }))
        socketService.sendChannelPin(channel, msgId)
        channelService.togglePin(channel, msgId).catch(console.error)
    }

    function formatTime(ts) {
        if (!ts) return ''
        const d = new Date(ts)
        return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }

    function formatDate(ts) {
        if (!ts) return ''
        const d = new Date(ts)
        const today = new Date()
        if (d.toDateString() === today.toDateString()) return "Aujourd'hui"
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        if (d.toDateString() === yesterday.toDateString()) return 'Hier'
        return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
    }

    // Filter messages if search is active or pinned view
    const filteredMessages = messages.filter(m => {
        if (isPinnedPanelOpen && !m.isPinned) return false
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase()
            const matchTxt = (m.txt || '').toLowerCase().includes(q)
            const matchFrom = (m.from || '').toLowerCase().includes(q)
            const matchAttach = (m.attachment?.name || '').toLowerCase().includes(q)
            if (!matchTxt && !matchFrom && !matchAttach) return false
        }
        return true
    })

    const pinnedCount = messages.filter(m => m.isPinned).length

    // Render message items with Slack/Discord reactions and attachments
    function renderMessages() {
        const groups = []
        let lastDate = null
        filteredMessages.forEach((m, idx) => {
            const msgDate = formatDate(m.timestamp)
            if (msgDate !== lastDate) {
                groups.push(
                    <div key={`date-${idx}`} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        margin: '12px 0 8px'
                    }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#1E293B' }} />
                        <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600', whiteSpace: 'nowrap' }}>
                            {msgDate}
                        </span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#1E293B' }} />
                    </div>
                )
                lastDate = msgDate
            }

            const isMe = m.fromId === String(loggedinUser._id) || m.from === loggedinUser.fullname
            const isHovered = activeHoverMsgId === m._id
            const myIdentifier = loggedinUser.fullname || 'Étudiant EPS'
            const reactions = m.reactions || {}
            const hasReactions = Object.keys(reactions).length > 0

            groups.push(
                <div
                    key={m._id || idx}
                    onMouseEnter={() => setActiveHoverMsgId(m._id)}
                    onMouseLeave={() => setActiveHoverMsgId(null)}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        position: 'relative',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        backgroundColor: isHovered ? 'rgba(30, 41, 59, 0.4)' : 'transparent',
                        transition: 'background-color 0.15s'
                    }}
                >
                    {/* Floating Slack Action Bar on Hover */}
                    {isHovered && (
                        <div style={{
                            position: 'absolute',
                            top: '-12px',
                            right: '12px',
                            backgroundColor: '#1E293B',
                            border: '1px solid #334155',
                            borderRadius: '20px',
                            padding: '2px 6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                            zIndex: 10
                        }}>
                            {QUICK_EMOJIS.slice(0, 4).map(emoji => (
                                <button
                                    key={emoji}
                                    onClick={() => onToggleReaction(m._id, emoji)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        padding: '2px 4px',
                                        borderRadius: '4px',
                                        transition: 'transform 0.1s'
                                    }}
                                    title={`Réagir avec ${emoji}`}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    {emoji}
                                </button>
                            ))}
                            <div style={{ width: '1px', height: '14px', backgroundColor: '#334155', margin: '0 2px' }} />
                            <button
                                onClick={() => onTogglePin(m._id)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '13px',
                                    color: m.isPinned ? '#F59E0B' : '#94A3B8',
                                    cursor: 'pointer',
                                    padding: '2px 4px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                                title={m.isPinned ? "Désépingler le message" : "Épingler le message"}
                            >
                                <HiOutlineBookmark />
                            </button>
                        </div>
                    )}

                    {/* Sender Info & Time */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {m.imgUrl ? (
                            <img src={m.imgUrl} alt={m.from} style={{
                                width: '24px', height: '24px', borderRadius: '50%',
                                border: `2px solid ${isMe ? meta.color : '#334155'}`
                            }} />
                        ) : (
                            <div style={{
                                width: '24px', height: '24px', borderRadius: '50%',
                                backgroundColor: isMe ? meta.color + '33' : '#1E293B',
                                border: `2px solid ${isMe ? meta.color : '#334155'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '11px', fontWeight: '700', color: isMe ? meta.color : '#94A3B8'
                            }}>
                                {(m.from || '?').charAt(0).toUpperCase()}
                            </div>
                        )}
                        <span style={{ fontWeight: '700', fontSize: '13px', color: isMe ? meta.color : '#A78BFA' }}>
                            {m.from}
                        </span>
                        <span style={{ fontSize: '10px', color: '#475569' }}>
                            {formatTime(m.timestamp)}
                        </span>
                        {m.isPinned && (
                            <span style={{
                                fontSize: '10px',
                                padding: '1px 5px',
                                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                                color: '#F59E0B',
                                border: '1px solid rgba(245, 158, 11, 0.3)',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '3px'
                            }}>
                                <HiOutlineBookmark /> Épinglé
                            </span>
                        )}
                    </div>

                    {/* Message Body */}
                    <div style={{
                        marginLeft: '32px',
                        backgroundColor: isMe ? '#1E293B' : '#1E293B88',
                        padding: '8px 12px',
                        borderRadius: '0 8px 8px 8px',
                        fontSize: '13px',
                        color: '#E2E8F0',
                        border: `1px solid ${isMe ? meta.color + '44' : '#334155'}`,
                        lineHeight: 1.5
                    }}>
                        {m.txt}

                        {/* Rich Document Card Attachment */}
                        {m.attachment && (
                            <div style={{
                                marginTop: '8px',
                                padding: '10px 12px',
                                backgroundColor: '#0B1221',
                                border: '1px solid #334155',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '12px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '6px',
                                        backgroundColor: '#0066B322', border: '1px solid #0066B366',
                                        color: '#38BDF8', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', fontSize: '18px'
                                    }}>
                                        <HiOutlineDocumentText />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#F8FAFC' }}>
                                            {m.attachment.name}
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#64748B' }}>
                                            {m.attachment.size} • Ressource PolyDrive EPS
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => alert(`Téléchargement de ${m.attachment.name} démarré.`)}
                                    style={{
                                        padding: '4px 8px',
                                        backgroundColor: '#1E293B',
                                        border: '1px solid #334155',
                                        borderRadius: '6px',
                                        color: '#38BDF8',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}
                                >
                                    <HiOutlineArrowDownTray /> Consulter
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Emoji Reactions Pills under message */}
                    {hasReactions && (
                        <div style={{
                            marginLeft: '32px',
                            marginTop: '4px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '4px'
                        }}>
                            {Object.entries(reactions).map(([emoji, users]) => {
                                const hasReacted = users.includes(myIdentifier)
                                return (
                                    <button
                                        key={emoji}
                                        onClick={() => onToggleReaction(m._id, emoji)}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            padding: '2px 7px',
                                            borderRadius: '12px',
                                            fontSize: '11px',
                                            fontWeight: '600',
                                            backgroundColor: hasReacted ? 'rgba(0, 102, 179, 0.25)' : '#1E293B',
                                            border: `1px solid ${hasReacted ? '#0066B3' : '#334155'}`,
                                            color: hasReacted ? '#38BDF8' : '#CBD5E1',
                                            cursor: 'pointer',
                                            transition: 'all 0.15s'
                                        }}
                                        title={`Réagi par: ${users.join(', ')}`}
                                    >
                                        <span>{emoji}</span>
                                        <span>{users.length}</span>
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>
            )
        })
        return groups
    }

    return (
        <div style={{
            position: 'fixed',
            top: '50px',
            right: 0,
            bottom: 0,
            width: '420px',
            backgroundColor: '#0B1221',
            borderLeft: '1px solid #1E293B',
            boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.5)',
            zIndex: 99990,
            display: 'flex',
            flexDirection: 'column',
            color: '#F8FAFC',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Header */}
            <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid #1E293B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#0F172A'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: meta.color, fontSize: '18px' }}>{meta.icon}</span>
                        <span style={{ fontWeight: '800', fontSize: '15px' }}>#{channel}</span>
                        <span style={{
                            fontSize: '10px', padding: '1px 6px',
                            backgroundColor: meta.color + '22', color: meta.color,
                            border: `1px solid ${meta.color}55`, borderRadius: '4px', fontWeight: '700'
                        }}>POLYSPACE</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748B', paddingLeft: '26px' }}>{meta.desc}</span>
                </div>

                {/* Header Action Icons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Search in channel toggle */}
                    <button
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        style={{
                            background: isSearchOpen ? '#0066B3' : 'transparent',
                            border: 'none',
                            color: isSearchOpen ? '#FFF' : '#94A3B8',
                            cursor: 'pointer',
                            fontSize: '16px',
                            padding: '5px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                        title="Rechercher dans le canal"
                    >
                        <HiOutlineMagnifyingGlass />
                    </button>

                    {/* Pinned messages toggle */}
                    <button
                        onClick={() => setIsPinnedPanelOpen(!isPinnedPanelOpen)}
                        style={{
                            background: isPinnedPanelOpen ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                            border: 'none',
                            color: isPinnedPanelOpen ? '#F59E0B' : '#94A3B8',
                            cursor: 'pointer',
                            fontSize: '16px',
                            padding: '5px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            position: 'relative'
                        }}
                        title="Messages épinglés"
                    >
                        <HiOutlineBookmark />
                        {pinnedCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-2px',
                                right: '-2px',
                                background: '#F59E0B',
                                color: '#000',
                                fontSize: '9px',
                                fontWeight: '800',
                                width: '14px',
                                height: '14px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {pinnedCount}
                            </span>
                        )}
                    </button>

                    {/* Close Drawer Button */}
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent', border: 'none',
                            color: '#64748B', cursor: 'pointer', fontSize: '20px',
                            padding: '4px', borderRadius: '4px',
                            display: 'flex', alignItems: 'center',
                            transition: 'color 0.15s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#F8FAFC'}
                        onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
                    >
                        <IoClose />
                    </button>
                </div>
            </div>

            {/* In-channel Search Bar */}
            {isSearchOpen && (
                <div style={{
                    padding: '8px 14px',
                    backgroundColor: '#1E293B',
                    borderBottom: '1px solid #334155',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <HiOutlineMagnifyingGlass style={{ color: '#94A3B8' }} />
                    <input
                        type="text"
                        placeholder="Rechercher dans ce salon..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            color: '#FFF',
                            fontSize: '12.5px',
                            outline: 'none'
                        }}
                        autoFocus
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                        >
                            <HiOutlineXMark />
                        </button>
                    )}
                </div>
            )}

            {/* Discord Voice Huddle Room Banner 🎧 */}
            <div style={{
                padding: '10px 14px',
                backgroundColor: isVoiceConnected ? '#052E16' : '#0B1728',
                borderBottom: '1px solid #1E293B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'background-color 0.2s'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '26px', height: '26px', borderRadius: '50%',
                        backgroundColor: isVoiceConnected ? '#10B98133' : '#1E293B',
                        border: `1px solid ${isVoiceConnected ? '#10B981' : '#334155'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: isVoiceConnected ? '#10B981' : '#94A3B8', fontSize: '13px'
                    }}>
                        <HiOutlineSpeakerWave />
                    </div>
                    <div>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: isVoiceConnected ? '#34D399' : '#F8FAFC' }}>
                            {isVoiceConnected ? 'Connecté au Salon Vocal EPS' : 'Salon Vocal PolySpace 🎧'}
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#64748B' }}>
                            {isVoiceConnected ? 'Micro & audio temps réel actifs' : '3 étudiants connectés en vocal'}
                        </div>
                    </div>
                </div>

                {isVoiceConnected ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            style={{
                                padding: '4px 8px',
                                borderRadius: '6px',
                                backgroundColor: isMuted ? '#EF444433' : '#1E293B',
                                color: isMuted ? '#EF4444' : '#10B981',
                                border: `1px solid ${isMuted ? '#EF4444' : '#334155'}`,
                                fontSize: '12px', cursor: 'pointer'
                            }}
                            title={isMuted ? "Activer le micro" : "Couper le micro"}
                        >
                            <HiOutlineMicrophone />
                        </button>
                        <button
                            onClick={() => setIsScreenSharing(!isScreenSharing)}
                            style={{
                                padding: '4px 8px',
                                borderRadius: '6px',
                                backgroundColor: isScreenSharing ? '#38BDF833' : '#1E293B',
                                color: isScreenSharing ? '#38BDF8' : '#94A3B8',
                                border: '1px solid #334155',
                                fontSize: '12px', cursor: 'pointer'
                            }}
                            title="Partager l'écran"
                        >
                            <HiOutlineComputerDesktop />
                        </button>
                        <button
                            onClick={() => setIsVoiceConnected(false)}
                            style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                backgroundColor: '#DC2626',
                                color: '#FFF',
                                border: 'none',
                                fontSize: '11.5px',
                                fontWeight: '700',
                                cursor: 'pointer'
                            }}
                        >
                            Quitter
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsVoiceConnected(true)}
                        style={{
                            padding: '5px 12px',
                            borderRadius: '6px',
                            backgroundColor: '#0066B3',
                            color: '#FFF',
                            border: 'none',
                            fontSize: '11.5px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 6px rgba(0, 102, 179, 0.3)'
                        }}
                    >
                        Rejoindre
                    </button>
                )}
            </div>

            {/* Pinned Messages Header notification if active */}
            {isPinnedPanelOpen && (
                <div style={{
                    padding: '8px 14px',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: '#F59E0B',
                    fontWeight: '600'
                }}>
                    <span>📌 Affichage des {pinnedCount} messages épinglés</span>
                    <button
                        onClick={() => setIsPinnedPanelOpen(false)}
                        style={{ background: 'none', border: 'none', color: '#F59E0B', cursor: 'pointer', fontSize: '11px', textDecoration: 'underline' }}
                    >
                        Voir tous les messages
                    </button>
                </div>
            )}

            {/* Messages Area */}
            <div style={{
                flex: 1, overflowY: 'auto', padding: '14px',
                display: 'flex', flexDirection: 'column', gap: '8px'
            }}>
                {/* Welcome pinned message */}
                {!isPinnedPanelOpen && !searchQuery && (
                    <div style={{
                        padding: '10px 14px', borderRadius: '8px',
                        backgroundColor: meta.color + '11',
                        border: `1px dashed ${meta.color}44`,
                        fontSize: '12px', color: '#94A3B8',
                    }}>
                        <span style={{ color: meta.color, fontWeight: '700' }}>{meta.icon} #{channel} — </span>
                        {meta.welcome}
                    </div>
                )}

                {/* Loading state */}
                {isLoading && (
                    <div style={{
                        display: 'flex', justifyContent: 'center', padding: '20px',
                        color: '#475569', fontSize: '13px'
                    }}>
                        <div style={{
                            width: '20px', height: '20px',
                            border: `2px solid ${meta.color}44`,
                            borderTopColor: meta.color,
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                            marginRight: '8px'
                        }} />
                        Chargement de l'historique...
                    </div>
                )}

                {/* Error state */}
                {error && !isLoading && (
                    <div style={{
                        padding: '10px 14px', borderRadius: '8px',
                        backgroundColor: '#EF444411', border: '1px solid #EF444433',
                        fontSize: '12px', color: '#EF4444'
                    }}>
                        {error}
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && !error && filteredMessages.length === 0 && (
                    <div style={{
                        flex: 1, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        color: '#475569', gap: '8px', paddingTop: '40px'
                    }}>
                        <span style={{ fontSize: '36px', color: meta.color + '55' }}>{meta.icon}</span>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#64748B' }}>
                            {searchQuery ? 'Aucun message ne correspond à la recherche' : `Soyez le premier à écrire sur #${channel}`}
                        </p>
                    </div>
                )}

                {/* Messages */}
                {!isLoading && renderMessages()}

                <div ref={messagesEndRef} />
            </div>

            {/* Typing Indicator */}
            {typingUser && (
                <div style={{
                    padding: '4px 16px', fontSize: '11px',
                    color: meta.color, fontStyle: 'italic'
                }}>
                    {typingUser} est en train d'écrire...
                </div>
            )}

            {/* Pending Attachment Preview */}
            {pendingAttachment && (
                <div style={{
                    padding: '8px 14px',
                    backgroundColor: '#1E293B',
                    borderTop: '1px solid #334155',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38BDF8' }}>
                        <HiOutlineDocumentText />
                        <span>Fichier joint : <strong>{pendingAttachment.name}</strong> ({pendingAttachment.size})</span>
                    </div>
                    <button
                        onClick={() => setPendingAttachment(null)}
                        style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                    >
                        <HiOutlineXMark />
                    </button>
                </div>
            )}

            {/* Input Footer */}
            <div style={{
                position: 'relative',
                borderTop: '1px solid #1E293B',
                backgroundColor: '#0F172A'
            }}>
                {/* Paperclip Resource Dropdown */}
                {isAttachMenuOpen && (
                    <div style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '12px',
                        backgroundColor: '#1E293B',
                        border: '1px solid #334155',
                        borderRadius: '10px',
                        padding: '10px',
                        width: '280px',
                        boxShadow: '0 -4px 16px rgba(0,0,0,0.4)',
                        zIndex: 20
                    }}>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', marginBottom: '8px', textTransform: 'uppercase' }}>
                            Partager une ressource EPS
                        </div>
                        {PRESET_ATTACHMENTS.map(item => (
                            <div
                                key={item.name}
                                onClick={() => {
                                    setPendingAttachment(item)
                                    setIsAttachMenuOpen(false)
                                }}
                                style={{
                                    padding: '6px 8px',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    color: '#E2E8F0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '4px',
                                    backgroundColor: '#0F172A'
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0066B333'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0F172A'}
                            >
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    📄 {item.name}
                                </span>
                                <span style={{ fontSize: '10px', color: '#64748B' }}>{item.size}</span>
                            </div>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSend} style={{
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    {/* Paperclip File Attach Button */}
                    <button
                        type="button"
                        onClick={() => setIsAttachMenuOpen(!isAttachMenuOpen)}
                        style={{
                            background: isAttachMenuOpen ? '#0066B3' : '#1E293B',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: isAttachMenuOpen ? '#FFF' : '#94A3B8',
                            fontSize: '16px',
                            padding: '9px 10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        title="Joindre un document PolyDrive"
                    >
                        <HiOutlinePaperClip />
                    </button>

                    <input
                        type="text"
                        placeholder={`Message sur #${channel}...`}
                        value={newMsg}
                        onChange={handleInputChange}
                        style={{
                            flex: 1,
                            padding: '10px 14px',
                            borderRadius: '8px',
                            backgroundColor: '#1E293B',
                            border: `1px solid ${newMsg ? meta.color + '66' : '#334155'}`,
                            color: '#F8FAFC',
                            fontSize: '13px',
                            outline: 'none',
                            transition: 'border-color 0.2s'
                        }}
                        autoComplete="off"
                    />

                    <button
                        type="submit"
                        disabled={!newMsg.trim() && !pendingAttachment}
                        style={{
                            padding: '10px 14px',
                            borderRadius: '8px',
                            backgroundColor: (newMsg.trim() || pendingAttachment) ? '#0066B3' : '#1E293B',
                            color: (newMsg.trim() || pendingAttachment) ? '#FFF' : '#475569',
                            border: 'none',
                            cursor: (newMsg.trim() || pendingAttachment) ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        <IoSend />
                    </button>
                </form>
            </div>
        </div>
    )
}
