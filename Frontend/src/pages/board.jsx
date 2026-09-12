import React, { useCallback, useEffect, useState, useRef } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { loadBoard, removeBoard, updateBoard } from '../store/board.actions'
import { GroupList } from '../cmps/group/group-list'
import { BoardSideMenu } from '../cmps/board/board-side-menu'
import { LiveCursors } from '../cmps/live-cursors'
import { SlackChatDrawer } from '../cmps/slack-chat-drawer'
import { PricingModal } from '../cmps/pricing-modal'
import { CommandPalette } from '../cmps/command-palette'
import { workspaceService } from '../services/workspace.service'
import {
    socketService,
    SOCKET_EVENT_UPDATE_BOARD,
    SOCKET_EVENT_BOARD_PRESENCE
} from '../services/socket.service.js'

import Loader from '../assets/img/loader.svg'
import {
    HiOutlineStar,
    HiOutlineChatBubbleLeftRight,
    HiOutlineCommandLine,
    HiOutlineSparkles,
    HiViewColumns,
    HiQueueList,
    HiCalendarDays
} from 'react-icons/hi2'
import { HiDotsHorizontal } from 'react-icons/hi'

export function Board() {
    const { boardId } = useParams()
    const board = useSelector((storeState) => storeState.boardModule.board)
    const [boardTitle, setBoardTitle] = useState('')
    const [titleWidth, setTitleWidth] = useState(null)
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [isPricingOpen, setIsPricingOpen] = useState(false)
    const [isCommandOpen, setIsCommandOpen] = useState(false)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [currentWorkspace, setCurrentWorkspace] = useState(null)
    const [isLoadError, setIsLoadError] = useState(false)
    
    const boardContainerRef = useRef(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const socketUpdateBoard = useCallback(
        (updatedBoard) => {
            dispatch({ type: 'SET_BOARD', board: updatedBoard })
        },
        [dispatch]
    )

    useEffect(() => {
        setIsLoadError(false)
        loadTheBoard(boardId)
        workspaceService.query().then(wsList => {
            if (wsList && wsList.length) setCurrentWorkspace(wsList[0])
        }).catch(console.error)
    }, [boardId])

    async function loadTheBoard(boardId) {
        try {
            const loadedBoard = await loadBoard(boardId)
            if (!loadedBoard) {
                setIsLoadError(true)
                return
            }
            setBoardTitle(loadedBoard.title || '')
            setTitleWidth((loadedBoard.title || '').length * 10 + 40)
            socketService.joinBoard(boardId)
        } catch (err) {
            console.log('Failed to load the board', err)
            setIsLoadError(true)
        }
    }

    useEffect(() => {
        function handlePresence(users) {
            setOnlineUsers(users)
        }

        socketService.on(SOCKET_EVENT_UPDATE_BOARD, socketUpdateBoard)
        socketService.on(SOCKET_EVENT_BOARD_PRESENCE, handlePresence)

        return () => {
            socketService.off(SOCKET_EVENT_UPDATE_BOARD, socketUpdateBoard)
            socketService.off(SOCKET_EVENT_BOARD_PRESENCE, handlePresence)
        }
    }, [socketUpdateBoard])

    function handleEditBoardTitle({ target }) {
        setBoardTitle(target.value)
        setTitleWidth(boardTitle.length * 10 + 40)
    }

    async function onSaveBoardTitle() {
        if (!boardTitle) return
        board.title = boardTitle
        try {
            await updateBoard(board)
            socketService.emit('update-board', board)
        } catch (err) {
            console.log('Failed to update board title', err)
        }
    }

    async function handleKey(ev) {
        if (ev.code === 'Enter') {
            ev.preventDefault()
            handleEditBoardTitle(ev)
            onSaveBoardTitle()
            ev.target.blur()
        }
    }

    async function onRemoveBoard() {
        try {
            await removeBoard(board._id)
            navigate(`/workspace`)
        } catch (err) {
            console.log('Cannot remove board', err)
        }
    }

    async function onToggleStar() {
        board.isStarred = !board.isStarred
        try {
            await updateBoard(board)
        } catch (err) {
            console.log('Cannot update board', err)
        }
    }

    function onToggleSideMenu() {
        setIsSideMenuOpen(!isSideMenuOpen)
    }

    async function changeBackground({ background, backgroundColor, thumbnail }) {
        board.style = { background, backgroundColor, thumbnail }
        try {
            await updateBoard(board)
            socketService.emit('update-board', board)
        } catch (err) {
            console.log('Failed to update board background', err)
        }
    }

    function getBoardStyle() {
        if (!board.style) return
        if (board?.style.background) {
            return {
                background: `url("${board.style.background}") center center / cover`,
            }
        } else if (board?.style.backgroundColor) {
            return { backgroundColor: `${board.style.backgroundColor}` }
        }
        return { backgroundColor: `#0f172a` }
    }

    function getBoardTxtStyle(backgroundColor) {
        if (!backgroundColor) return 'dark-bg'
        var r = parseInt(backgroundColor.substring(1, 3), 16)
        var g = parseInt(backgroundColor.substring(3, 5), 16)
        var b = parseInt(backgroundColor.substring(5, 7), 16)
        var yiq = (r * 299 + g * 587 + b * 114) / 1000
        return yiq >= 160 ? 'light-bg' : 'dark-bg'
    }

    if (isLoadError)
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 'calc(100vh - 50px)',
                backgroundColor: '#0F172A',
                color: '#F8FAFC',
                gap: '16px',
                textAlign: 'center',
                padding: '20px'
            }}>
                <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Tableau introuvable ou indisponible</h2>
                <p style={{ color: '#94A3B8', fontSize: '14px', maxWidth: '420px', margin: 0 }}>
                    Ce tableau n'existe plus ou vous n'avez pas les autorisations nécessaires.
                </p>
                <button
                    onClick={() => navigate('/workspace')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#3B82F6',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    Retourner à l'Espace de Travail
                </button>
            </div>
        )

    if (!board)
        return (
            <div className="loader-wrapper">
                <img className="loader" src={Loader} alt="loader" />
            </div>
        )

    const boardStyle = getBoardStyle()
    const txtStyle = getBoardTxtStyle(board.style?.backgroundColor)
    const menuStatus = isSideMenuOpen ? 'open' : ''

    return (
        <section className="board" style={{ ...boardStyle, position: 'relative' }} ref={boardContainerRef}>
            {/* Live Multiplayer Cursors Overlay */}
            <LiveCursors boardContainerRef={boardContainerRef} />

            {/* Top Toolbar with Jira Design */}
            <div className={`board-top-menu-${txtStyle}`}>
                <div className="board-top-menu-left">
                    <div className="board-title">
                        <input
                            onBlurCapture={onSaveBoardTitle}
                            name="title"
                            className="edit-board-title"
                            id={board.id}
                            spellCheck="false"
                            defaultValue={board.title}
                            onChange={handleEditBoardTitle}
                            onKeyDown={handleKey}
                            style={{ width: `${titleWidth}px` }}
                        />
                    </div>

                    <button
                        className={`btn-board star-${board.isStarred}`}
                        onClick={onToggleStar}
                        title="Favori"
                    >
                        <HiOutlineStar />
                    </button>

                    {/* Jira-style View Switcher */}
                    <div className="jira-view-switcher">
                        <button className="view-pill active" title="Vue Tableau Kanban">
                            <HiViewColumns style={{ fontSize: '14px' }} /> Tableau
                        </button>
                        <button className="view-pill" title="Vue Liste des tickets">
                            <HiQueueList style={{ fontSize: '14px' }} /> Liste
                        </button>
                        <button className="view-pill" title="Vue Chronologie Gantt">
                            <HiCalendarDays style={{ fontSize: '14px' }} /> Chronologie
                        </button>
                    </div>

                    {/* Quick Command Palette trigger */}
                    <button
                        onClick={() => setIsCommandOpen(true)}
                        className="btn-command-palette"
                        title="Ouvrir la palette de commandes (Ctrl+K)"
                    >
                        <HiOutlineCommandLine /> <kbd>Ctrl+K</kbd>
                    </button>
                </div>

                <div className={`board-top-menu-right ${menuStatus}`}>
                    {/* Live Online Presence Avatars */}
                    <div className="live-presence-indicator">
                        <span className="live-dot" />
                        <span>{onlineUsers.length || 1} en direct</span>
                    </div>

                    {/* Slack-style Chat Button */}
                    <button
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className={`btn-chat-toggle ${isChatOpen ? 'active' : ''}`}
                    >
                        <HiOutlineChatBubbleLeftRight style={{ fontSize: '15px' }} /> Discussion
                    </button>

                    {/* Pricing / Plan Badge */}
                    <button
                        onClick={() => setIsPricingOpen(true)}
                        className="btn-plan-pro"
                    >
                        <HiOutlineSparkles /> Plan Pro
                    </button>

                    <button
                        className={`btn-board menu ${menuStatus}`}
                        onClick={onToggleSideMenu}
                        title="Menu du tableau"
                    >
                        <HiDotsHorizontal className="icon-more" />
                    </button>

                    {isSideMenuOpen && (
                        <BoardSideMenu
                            onToggleSideMenu={onToggleSideMenu}
                            changeBackground={changeBackground}
                            onRemoveBoard={onRemoveBoard}
                        />
                    )}
                </div>
            </div>

            {/* Kanban Groups & Cards */}
            <div className="board-main-content">
                <GroupList />
            </div>

            {/* Slide-in Real-time Slack Chat Drawer */}
            <SlackChatDrawer
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                channel={board.title || 'général'}
            />

            {/* Pricing Modal */}
            <PricingModal
                isOpen={isPricingOpen}
                onClose={() => setIsPricingOpen(false)}
                currentWorkspace={currentWorkspace}
                onPlanUpdated={(newPlan) => {
                    if (currentWorkspace) setCurrentWorkspace({ ...currentWorkspace, plan: newPlan })
                }}
            />

            {/* Command Palette */}
            <CommandPalette
                isOpen={isCommandOpen}
                onClose={() => setIsCommandOpen(false)}
                onOpenPricing={() => setIsPricingOpen(true)}
                onOpenChat={() => setIsChatOpen(true)}
            />

            <Outlet />
        </section>
    )
}
