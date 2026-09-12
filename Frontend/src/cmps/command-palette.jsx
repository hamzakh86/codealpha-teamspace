import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { 
    HiOutlineMagnifyingGlass, 
    HiOutlinePlus, 
    HiOutlineViewColumns, 
    HiOutlineSparkles,
    HiOutlineHashtag,
    HiOutlineArrowRight
} from 'react-icons/hi2'

export function CommandPalette({ isOpen, onClose, onOpenPricing, onOpenChat }) {
    const navigate = useNavigate()
    const boards = useSelector((storeState) => storeState.boardModule.boards) || []
    const [search, setSearch] = useState('')

    useEffect(() => {
        function handleKeyDown(e) {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                if (isOpen) onClose()
                else onClose(false) // Toggle
            }
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, onClose])

    if (!isOpen) return null

    const filteredBoards = boards.filter(b => b.title.toLowerCase().includes(search.toLowerCase()))

    function handleSelectBoard(boardId) {
        navigate(`/board/${boardId}`)
        onClose()
    }

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '12vh',
            zIndex: 1000000
        }} onClick={onClose}>
            <div style={{
                backgroundColor: '#1E293B',
                width: '100%',
                maxWidth: '560px',
                borderRadius: '12px',
                border: '1px solid #334155',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
                overflow: 'hidden',
                color: '#F8FAFC'
            }} onClick={(e) => e.stopPropagation()}>
                {/* Search Bar */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 18px',
                    borderBottom: '1px solid #334155'
                }}>
                    <HiOutlineMagnifyingGlass style={{ fontSize: '18px', color: '#94A3B8' }} />
                    <input
                        autoFocus
                        type="text"
                        placeholder="Rechercher un board, une commande (Ctrl+K)..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            border: 'none',
                            outline: 'none',
                            color: '#F8FAFC',
                            fontSize: '15px'
                        }}
                    />
                    <kbd style={{
                        fontSize: '11px',
                        padding: '2px 6px',
                        backgroundColor: '#334155',
                        borderRadius: '4px',
                        color: '#94A3B8'
                    }}>ESC</kbd>
                </div>

                {/* Results List */}
                <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '8px' }}>
                    {/* Boards Results */}
                    {filteredBoards.length > 0 && (
                        <div style={{ marginBottom: '10px' }}>
                            <div style={{ padding: '6px 10px', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>
                                Boards
                            </div>
                            {filteredBoards.map(board => (
                                <div
                                    key={board._id}
                                    onClick={() => handleSelectBoard(board._id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'background 0.15s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#334155'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <HiOutlineViewColumns style={{ color: '#38BDF8' }} />
                                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{board.title}</span>
                                    </div>
                                    <HiOutlineArrowRight style={{ color: '#64748B', fontSize: '14px' }} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div>
                        <div style={{ padding: '6px 10px', fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>
                            Actions Rapides
                        </div>
                        <div
                            onClick={() => { navigate('/workspace'); onClose(); }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#334155'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <HiOutlinePlus style={{ color: '#10B981' }} />
                            <span style={{ fontSize: '14px' }}>Créer un nouveau board</span>
                        </div>

                        <div
                            onClick={() => { if (onOpenPricing) onOpenPricing(); onClose(); }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#334155'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <HiOutlineSparkles style={{ color: '#F59E0B' }} />
                            <span style={{ fontSize: '14px' }}>Gérer l'abonnement & Quotas Pro</span>
                        </div>

                        <div
                            onClick={() => { if (onOpenChat) onOpenChat('général'); onClose(); }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#334155'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <HiOutlineHashtag style={{ color: '#8B5CF6' }} />
                            <span style={{ fontSize: '14px' }}>Ouvrir le canal de discussion d'équipe</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
