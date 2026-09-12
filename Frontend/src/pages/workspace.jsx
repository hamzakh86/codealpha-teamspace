import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { loadBoards, updateBoard } from '../store/board.actions'
import { BoardCreate } from '../cmps/board/board-create'
import { BoardPreview } from '../cmps/board/board-preview'
import { CollabFlowSidebar } from '../cmps/collabflow-sidebar'
import { PricingModal } from '../cmps/pricing-modal'
import { SlackChatDrawer } from '../cmps/slack-chat-drawer'
import { CommandPalette } from '../cmps/command-palette'
import { workspaceService } from '../services/workspace.service'

import {
    HiOutlineStar,
    HiOutlinePlus,
    HiOutlineSparkles,
    HiOutlineCheckCircle,
    HiOutlineFire,
    HiOutlineMagnifyingGlass,
    HiOutlineXMark,
    HiOutlineSquares2X2,
    HiOutlineListBullet,
    HiOutlineAcademicCap,
    HiOutlineCpuChip,
    HiOutlineCodeBracket,
    HiOutlineBookOpen
} from 'react-icons/hi2'
import { ReactComponent as UserSvg } from '../assets/img/icons-header/user.svg'
import Loader from '../assets/img/loader.svg'

function getBoardCategory(board) {
    const text = `${board.title || ''} ${board.description || ''} ${(board.labels || []).map(l => l.title).join(' ')}`.toLowerCase()
    if (/pfe|pfa|stage|investor/.test(text)) return 'pfe'
    if (/robot|iot|electron|hard|play/.test(text)) return 'robotics'
    if (/software|front|dev|code|web|app|meet/.test(text)) return 'software'
    if (/prepa|math|phys|cours|vacat|task/.test(text)) return 'prepa'
    return 'general'
}

function getCategoryBadge(cat) {
    switch (cat) {
        case 'pfe': return { label: 'PFA & PFE', icon: <HiOutlineAcademicCap />, color: '#F58220' }
        case 'robotics': return { label: 'Robotique & IoT', icon: <HiOutlineCpuChip />, color: '#10B981' }
        case 'software': return { label: 'Génie Logiciel', icon: <HiOutlineCodeBracket />, color: '#38BDF8' }
        case 'prepa': return { label: 'Prépa & Cours', icon: <HiOutlineBookOpen />, color: '#A78BFA' }
        default: return { label: 'Projet Tech', icon: <HiOutlineSparkles />, color: '#94A3B8' }
    }
}

export function Workspace() {
    const boards = useSelector((storeState) => storeState.boardModule.boards)
    const [isBoardComposerOpen, setIsBoardComposerOpen] = useState(false)
    const [isPricingOpen, setIsPricingOpen] = useState(false)
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [activeChannel, setActiveChannel] = useState('polyoverflow')
    const [isCommandOpen, setIsCommandOpen] = useState(false)
    const [currentWorkspace, setCurrentWorkspace] = useState(null)
    const [stats, setStats] = useState({ totalBoards: 0, totalCards: 0, doneCards: 0, urgentCards: 0, completionRate: 0 })

    // Interactive Filter & Search states
    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState('all') // 'all' | 'favorites' | 'pfe' | 'software' | 'robotics' | 'prepa'
    const [sortBy, setSortBy] = useState('recent') // 'recent' | 'alpha-asc' | 'alpha-desc' | 'starred-first'
    const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'

    const createBtn = useRef()
    const refDataBtn = createBtn

    useEffect(() => {
        loadBoards()
        workspaceService.query()
            .then(wsList => {
                if (wsList && wsList.length) {
                    const ws = wsList[0]
                    setCurrentWorkspace(ws)
                    return workspaceService.getStats(ws._id)
                }
            })
            .then(s => { if (s) setStats(s) })
            .catch(console.error)
    }, [])

    function openBoardComposer() {
        setIsBoardComposerOpen(true)
    }

    function closeBoardComposer() {
        setIsBoardComposerOpen(false)
    }

    async function onToggleStar(event, board) {
        event.stopPropagation()
        event.preventDefault()
        board.isStarred = !board.isStarred
        try {
            await updateBoard(board)
        } catch (err) {
            console.log('Cannot update board', err)
        }
    }

    if (!boards)
        return (
            <div className="loader-wrapper">
                <img className="loader" src={Loader} alt="loader" />
            </div>
        )

    // Category counts calculation
    const totalCount = boards.length
    const starredCount = boards.filter(b => b.isStarred).length
    const pfeCount = boards.filter(b => getBoardCategory(b) === 'pfe').length
    const softwareCount = boards.filter(b => getBoardCategory(b) === 'software').length
    const roboticsCount = boards.filter(b => getBoardCategory(b) === 'robotics').length
    const prepaCount = boards.filter(b => getBoardCategory(b) === 'prepa').length

    // Filter boards
    const filteredBoards = boards.filter(board => {
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim()
            const matchTitle = (board.title || '').toLowerCase().includes(q)
            const matchDesc = (board.description || '').toLowerCase().includes(q)
            if (!matchTitle && !matchDesc) return false
        }
        if (activeCategory === 'favorites') return !!board.isStarred
        if (activeCategory === 'pfe') return getBoardCategory(board) === 'pfe'
        if (activeCategory === 'software') return getBoardCategory(board) === 'software'
        if (activeCategory === 'robotics') return getBoardCategory(board) === 'robotics'
        if (activeCategory === 'prepa') return getBoardCategory(board) === 'prepa'
        return true
    })

    // Sort filtered boards
    const sortedBoards = [...filteredBoards].sort((a, b) => {
        if (sortBy === 'alpha-asc') return (a.title || '').localeCompare(b.title || '')
        if (sortBy === 'alpha-desc') return (b.title || '').localeCompare(a.title || '')
        if (sortBy === 'starred-first') {
            const starA = a.isStarred ? 1 : 0
            const starB = b.isStarred ? 1 : 0
            if (starB !== starA) return starB - starA
            return (a.title || '').localeCompare(b.title || '')
        }
        return 0 // recent
    })

    const starredFilteredBoards = sortedBoards.filter(b => b.isStarred)

    return (
        <div className="workspace-container" style={{ display: 'flex', minHeight: 'calc(100vh - 50px)', flex: 1 }}>
            {/* Modern Slack-Style Left Navigation Sidebar */}
            <CollabFlowSidebar
                onOpenPricing={() => setIsPricingOpen(true)}
                onOpenChat={(chan) => { setActiveChannel(chan); setIsChatOpen(true); }}
            />

            {/* Main Content Area */}
            <main className="workspace-main-area" style={{ flex: 1, padding: '24px 36px', overflowY: 'auto' }}>
                {/* Header with Metrics & Actions */}
                <div className="workspace-header-row" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '28px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #1E293B'
                }}>
                    <div>
                        <h1 style={{ fontSize: '26px', fontWeight: '800', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
                            Espace de Travail & Sprints
                        </h1>
                        <p style={{ margin: 0, color: '#94A3B8', fontSize: '14px' }}>
                            Gérez vos projets collaboratifs, suivez la vélocité et communiquez en direct avec vos équipes.
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                            onClick={() => setIsCommandOpen(true)}
                            style={{
                                padding: '8px 14px',
                                backgroundColor: '#1E293B',
                                border: '1px solid #334155',
                                borderRadius: '8px',
                                color: '#94A3B8',
                                fontSize: '13px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            Rechercher <kbd style={{ fontSize: '11px', padding: '1px 5px', backgroundColor: '#334155', borderRadius: '4px', color: '#CBD5E1' }}>Ctrl+K</kbd>
                        </button>

                        <button
                            onClick={openBoardComposer}
                            ref={createBtn}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#0066B3',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: '0 2px 8px rgba(0, 102, 179, 0.3)'
                            }}
                        >
                            <HiOutlinePlus /> Nouveau Board
                        </button>
                    </div>
                </div>

                {/* SaaS Analytics Overview Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '16px',
                    marginBottom: '32px'
                }}>
                    <div className="workspace-stat-card" style={{ padding: '16px', borderRadius: '12px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '6px' }}>
                            Boards Actifs
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: '800', color: '#38BDF8' }}>
                            {boards.length}
                        </div>
                    </div>

                    <div className="workspace-stat-card" style={{ padding: '16px', borderRadius: '12px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <HiOutlineStar style={{ color: '#F59E0B' }} /> Boards Favoris
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: '800', color: '#F59E0B' }}>
                            {starredCount}
                        </div>
                    </div>

                    <div className="workspace-stat-card" style={{ padding: '16px', borderRadius: '12px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <HiOutlineCheckCircle style={{ color: '#10B981' }} /> Taux d'achèvement
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: '800', color: '#10B981' }}>
                            {stats.completionRate || 42}%
                        </div>
                    </div>

                    <div className="workspace-stat-card" style={{ padding: '16px', borderRadius: '12px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <HiOutlineSparkles style={{ color: '#F58220' }} /> Abonnement EPS
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>Plan {currentWorkspace?.plan || 'ÉDUCATION PRO'}</span>
                            <span onClick={() => setIsPricingOpen(true)} style={{ fontSize: '12px', color: '#60A5FA', cursor: 'pointer', textDecoration: 'underline' }}>Détails</span>
                        </div>
                    </div>
                </div>

                {/* ── Interactive Filter & Search Bar ──────────────── */}
                <div className="workspace-toolbar-container">
                    <div className="workspace-toolbar-top">
                        {/* Search Box */}
                        <div className="workspace-search-box">
                            <span className="search-icon"><HiOutlineMagnifyingGlass /></span>
                            <input
                                type="text"
                                placeholder="Filtrer vos boards par nom ou mot-clé..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button className="clear-search-btn" onClick={() => setSearchQuery('')} title="Effacer la recherche">
                                    <HiOutlineXMark />
                                </button>
                            )}
                        </div>

                        {/* Controls right: Sort & View Mode */}
                        <div className="workspace-controls-right">
                            <div className="workspace-sort-wrapper">
                                <span>Trier par:</span>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="recent">Plus récents</option>
                                    <option value="starred-first">⭐ Favoris en premier</option>
                                    <option value="alpha-asc">Alphabétique (A-Z)</option>
                                    <option value="alpha-desc">Alphabétique (Z-A)</option>
                                </select>
                            </div>

                            <div className="workspace-view-toggle">
                                <button
                                    className={viewMode === 'grid' ? 'active' : ''}
                                    onClick={() => setViewMode('grid')}
                                    title="Vue Grille (Cartes)"
                                >
                                    <HiOutlineSquares2X2 />
                                </button>
                                <button
                                    className={viewMode === 'list' ? 'active' : ''}
                                    onClick={() => setViewMode('list')}
                                    title="Vue Liste Compacte (Style Linear/Slack)"
                                >
                                    <HiOutlineListBullet />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filter Pills */}
                    <div className="workspace-filter-pills">
                        <button
                            className={`filter-pill ${activeCategory === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('all')}
                        >
                            <span>Tous</span>
                            <span className="pill-count">{totalCount}</span>
                        </button>

                        <button
                            className={`filter-pill pill-favorite ${activeCategory === 'favorites' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('favorites')}
                        >
                            <span>⭐ Favoris</span>
                            <span className="pill-count">{starredCount}</span>
                        </button>

                        <button
                            className={`filter-pill ${activeCategory === 'pfe' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('pfe')}
                        >
                            <span>🎓 PFA & PFE</span>
                            <span className="pill-count">{pfeCount}</span>
                        </button>

                        <button
                            className={`filter-pill ${activeCategory === 'software' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('software')}
                        >
                            <span>💻 Génie Logiciel</span>
                            <span className="pill-count">{softwareCount}</span>
                        </button>

                        <button
                            className={`filter-pill ${activeCategory === 'robotics' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('robotics')}
                        >
                            <span>🤖 Robotique & IoT</span>
                            <span className="pill-count">{roboticsCount}</span>
                        </button>

                        <button
                            className={`filter-pill ${activeCategory === 'prepa' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('prepa')}
                        >
                            <span>📚 Prépa & Cours</span>
                            <span className="pill-count">{prepaCount}</span>
                        </button>
                    </div>
                </div>

                {/* ── Empty Filter State ───────────────────────────── */}
                {sortedBoards.length === 0 && (
                    <div className="workspace-empty-filter">
                        <span className="empty-icon">⭐</span>
                        <h4>Aucun tableau trouvé</h4>
                        <p>
                            {activeCategory === 'favorites'
                                ? "Vous n'avez pas encore de tableaux marqués comme favoris. Cliquez sur l'étoile d'un board pour l'épingler ici."
                                : "Aucun projet ne correspond à vos filtres ou à votre recherche actuelle."}
                        </p>
                        <button
                            className="btn-reset-filter"
                            onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>
                )}

                {/* ── Starred Section (Only in 'all' view when no active search) ── */}
                {activeCategory === 'all' && !searchQuery && starredFilteredBoards.length > 0 && viewMode === 'grid' && (
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                            <HiOutlineStar style={{ color: '#F59E0B', fontSize: '20px' }} />
                            <h3 className="workspace-section-title" style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>
                                Boards Favoris ({starredFilteredBoards.length})
                            </h3>
                        </div>

                        <ul className="board-list clean-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                            {starredFilteredBoards.map((strdBoard, idx) => {
                                const bId = strdBoard._id || strdBoard.id || `str_${idx}`
                                return (
                                    <li key={`starred-${bId}-${idx}`}>
                                        <Link to={`/board/${bId}`} style={{ textDecoration: 'none' }}>
                                            <BoardPreview board={strdBoard} onToggleStar={onToggleStar} />
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                )}

                {/* ── Main Board Collection Render ─────────────────── */}
                {sortedBoards.length > 0 && (
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <UserSvg />
                                <h3 className="workspace-section-title" style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>
                                    {activeCategory === 'favorites' ? 'Tableaux Favoris' : 'Tous vos Tableaux'}
                                    <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '500', marginLeft: '8px' }}>
                                        ({sortedBoards.length} {sortedBoards.length === 1 ? 'résultat' : 'résultats'})
                                    </span>
                                </h3>
                            </div>
                        </div>

                        {/* GRID VIEW */}
                        {viewMode === 'grid' && (
                            <ul className="board-list clean-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                                {sortedBoards.map((board, idx) => {
                                    const bId = board._id || board.id || `brd_${idx}`
                                    return (
                                        <li key={`your-${bId}-${idx}`}>
                                            <Link to={`/board/${bId}`} style={{ textDecoration: 'none' }}>
                                                <BoardPreview board={board} onToggleStar={onToggleStar} />
                                            </Link>
                                        </li>
                                    )
                                })}

                                {activeCategory === 'all' && !searchQuery && (
                                    <li
                                        className="board-preview create-new-board"
                                        onClick={openBoardComposer}
                                        key="001"
                                        style={{
                                            backgroundColor: '#1E293B',
                                            border: '2px dashed #334155',
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            minHeight: '100px',
                                            cursor: 'pointer',
                                            color: '#94A3B8',
                                            fontWeight: '600'
                                        }}
                                    >
                                        <span>+ Créer un nouveau board</span>
                                    </li>
                                )}
                            </ul>
                        )}

                        {/* LIST VIEW (Slack / Linear Style) */}
                        {viewMode === 'list' && (
                            <div className="workspace-list-view">
                                {sortedBoards.map((board, idx) => {
                                    const bId = board._id || board.id || `brd_list_${idx}`
                                    const cat = getBoardCategory(board)
                                    const catBadge = getCategoryBadge(cat)
                                    const thumb = board?.style?.thumbnail || board?.style?.background
                                    const bgColor = board?.style?.backgroundColor || '#0066B3'
                                    const creatorName = board?.createdBy?.fullname || 'Membre EPS'
                                    const creatorImg = board?.createdBy?.imgUrl

                                    return (
                                        <div key={`list-${bId}-${idx}`} className="workspace-list-row">
                                            <div className="row-left">
                                                <div
                                                    className="row-color-thumb"
                                                    style={{
                                                        background: thumb ? `url('${thumb}') center/cover` : bgColor
                                                    }}
                                                >
                                                    {!thumb && (board.title || 'B').charAt(0).toUpperCase()}
                                                </div>
                                                <div className="row-info">
                                                    <span className="row-title">{board.title}</span>
                                                    <div className="row-meta">
                                                        <span className="badge-cat" style={{ borderColor: catBadge.color + '66', color: catBadge.color }}>
                                                            {catBadge.label}
                                                        </span>
                                                        <span>•</span>
                                                        <span>{board.groups?.length || 0} listes</span>
                                                        <span>•</span>
                                                        <span>Mis à jour récemment</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row-right">
                                                <div className="creator-tag">
                                                    {creatorImg ? (
                                                        <img src={creatorImg} alt={creatorName} />
                                                    ) : (
                                                        <div style={{
                                                            width: 22, height: 22, borderRadius: '50%',
                                                            background: '#334155', display: 'flex',
                                                            alignItems: 'center', justifyContent: 'center',
                                                            fontSize: 10, color: '#F8FAFC'
                                                        }}>
                                                            {creatorName.charAt(0)}
                                                        </div>
                                                    )}
                                                    <span>{creatorName}</span>
                                                </div>

                                                <button
                                                    className={`star-btn ${board.isStarred ? 'is-starred' : ''}`}
                                                    onClick={(e) => onToggleStar(e, board)}
                                                    title={board.isStarred ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                                                >
                                                    <HiOutlineStar />
                                                </button>

                                                <Link to={`/board/${bId}`} className="open-board-link">
                                                    Ouvrir ➔
                                                </Link>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {isBoardComposerOpen && (
                            <BoardCreate
                                closeBoardComposer={closeBoardComposer}
                                refDataBtn={refDataBtn}
                            />
                        )}
                    </div>
                )}
            </main>

            {/* Slack-Style Live Chat Drawer */}
            <SlackChatDrawer
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                channel={activeChannel}
            />

            {/* Pricing Modal */}
            <PricingModal
                isOpen={isPricingOpen}
                onClose={() => setIsPricingOpen(false)}
                currentWorkspace={currentWorkspace}
            />

            {/* Command Palette (Ctrl+K) */}
            <CommandPalette
                isOpen={isCommandOpen}
                onClose={() => setIsCommandOpen(false)}
                onOpenPricing={() => setIsPricingOpen(true)}
                onOpenChat={(chan) => { setActiveChannel(chan); setIsChatOpen(true); }}
            />
        </div>
    )
}