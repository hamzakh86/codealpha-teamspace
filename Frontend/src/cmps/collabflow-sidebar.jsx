import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { workspaceService } from '../services/workspace.service'
import { 
    HiOutlineViewColumns, 
    HiOutlineHashtag, 
    HiOutlinePlus,
    HiOutlineUsers,
    HiOutlineChevronDown
} from 'react-icons/hi2'
import { IoFlash } from 'react-icons/io5'

export function CollabFlowSidebar({ onOpenPricing, onOpenChat, activeBoardId }) {
    const location = useLocation()
    const boards = useSelector((storeState) => storeState.boardModule.boards) || []
    
    const [currentWorkspace, setCurrentWorkspace] = useState(null)
    const [isWsDropdownOpen, setIsWsDropdownOpen] = useState(false)

    useEffect(() => {
        workspaceService.query().then(wsList => {
            if (wsList && wsList.length) {
                setCurrentWorkspace(wsList[0])
            }
        }).catch(console.error)
    }, [])

    const isPro = currentWorkspace?.plan === 'PRO' || currentWorkspace?.plan === 'ENTERPRISE'

    return (
        <aside className="collabflow-sidebar" style={{
            width: '260px',
            backgroundColor: '#0F172A',
            color: '#E2E8F0',
            height: 'calc(100vh - 50px)',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid #1E293B',
            userSelect: 'none',
            fontSize: '13px',
            flexShrink: 0
        }}>
            {/* Workspace Selector */}
            <div style={{
                padding: '14px 16px',
                borderBottom: '1px solid #1E293B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                position: 'relative'
            }} onClick={() => setIsWsDropdownOpen(!isWsDropdownOpen)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#0066B3',
                        color: '#FFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '14px',
                        border: '2px solid #F58220'
                    }}>
                        {currentWorkspace?.name ? currentWorkspace.name.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div>
                        <div style={{ fontWeight: '700', color: '#F8FAFC', fontSize: '14px', lineHeight: 1.2 }}>
                            {currentWorkspace?.name || 'PolySpace EPS'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                            <span style={{
                                fontSize: '10px',
                                fontWeight: '700',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                backgroundColor: isPro ? '#3B82F633' : '#334155',
                                color: isPro ? '#60A5FA' : '#94A3B8',
                                textTransform: 'uppercase'
                            }}>
                                {currentWorkspace?.plan || 'FREE'}
                            </span>
                            <span style={{ fontSize: '11px', color: '#64748B' }}>
                                {currentWorkspace?.members?.length || 3} membres
                            </span>
                        </div>
                    </div>
                </div>
                <HiOutlineChevronDown style={{ color: '#94A3B8' }} />
            </div>

            {/* Scrollable Navigation */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 10px' }}>
                {/* Main Links */}
                <div style={{ marginBottom: '18px' }}>
                    <Link
                        to="/workspace"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            color: location.pathname === '/workspace' ? '#38BDF8' : '#CBD5E1',
                            backgroundColor: location.pathname === '/workspace' ? '#1E293B' : 'transparent',
                            textDecoration: 'none',
                            fontWeight: '500'
                        }}
                    >
                        <HiOutlineViewColumns style={{ fontSize: '16px' }} />
                        <span>Tous les Boards</span>
                    </Link>
                </div>

                {/* Slack-Inspired Channels Section */}
                <div style={{ marginBottom: '18px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '4px 10px',
                        color: '#64748B',
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        <span style={{ color: '#F58220' }}>Salons PolySpace</span>
                        <HiOutlinePlus style={{ cursor: 'pointer' }} onClick={() => onOpenChat && onOpenChat('polyoverflow')} />
                    </div>

                    {(currentWorkspace?.channels || ['polyoverflow', 'polystages-pfe', 'polyfreelance', 'polydrive-examens', 'vie-du-campus']).map(chan => (
                        <div
                            key={chan}
                            onClick={() => onOpenChat && onOpenChat(chan)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '7px 10px',
                                borderRadius: '6px',
                                color: '#CBD5E1',
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                                fontSize: '12.5px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#1E293B'
                                e.currentTarget.style.color = '#38BDF8'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent'
                                e.currentTarget.style.color = '#CBD5E1'
                            }}
                        >
                            <HiOutlineHashtag style={{ fontSize: '14px', color: '#F58220' }} />
                            <span style={{ fontWeight: '500' }}>{chan}</span>
                        </div>
                    ))}
                </div>

                {/* Boards List Section */}
                <div style={{ marginBottom: '18px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '4px 10px',
                        color: '#64748B',
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        <span>Vos Boards</span>
                        <Link to="/workspace" style={{ color: '#64748B' }}>
                            <HiOutlinePlus />
                        </Link>
                    </div>

                    {boards.slice(0, 6).map((board, idx) => {
                        const bId = board._id || board.id || `sb_brd_${idx}`
                        const isActive = activeBoardId === bId
                        return (
                            <Link
                                key={`sidebar-${bId}-${idx}`}
                                to={`/board/${bId}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    color: isActive ? '#38BDF8' : '#CBD5E1',
                                    backgroundColor: isActive ? '#1E293B' : 'transparent',
                                    textDecoration: 'none',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                <span style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '2px',
                                    backgroundColor: board.style?.bg || '#3B82F6',
                                    flexShrink: 0
                                }}></span>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{board.title}</span>
                            </Link>
                        )
                    })}
                </div>

                {/* Active Team Members */}
                <div style={{ marginBottom: '18px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '4px 10px',
                        color: '#64748B',
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        <span>Collaborateurs</span>
                        <HiOutlineUsers />
                    </div>

                    {currentWorkspace?.members?.length > 0 ? (
                        currentWorkspace.members.map(m => (
                            <div
                                key={m._id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '5px 10px',
                                    color: '#94A3B8',
                                    fontSize: '12px'
                                }}
                            >
                                <span style={{
                                    width: '7px',
                                    height: '7px',
                                    borderRadius: '50%',
                                    backgroundColor: '#10B981',
                                    boxShadow: '0 0 6px #10B981'
                                }}></span>
                                <span>{m.fullname}</span>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '6px 10px', color: '#475569', fontSize: '12px', fontStyle: 'italic' }}>
                            Chargement des membres...
                        </div>
                    )}
                </div>
            </div>

            {/* Upgrade Banner Bottom */}
            {!isPro && (
                <div style={{
                    padding: '14px',
                    margin: '10px',
                    borderRadius: '10px',
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    textAlign: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#60A5FA', fontWeight: '700', marginBottom: '4px' }}>
                        <IoFlash /> Passer à CollabFlow Pro
                    </div>
                    <p style={{ color: '#94A3B8', fontSize: '11px', margin: '0 0 10px 0' }}>
                        Curseurs live illimités, membres et canaux privés.
                    </p>
                    <button
                        onClick={onOpenPricing}
                        style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '6px',
                            backgroundColor: '#3B82F6',
                            color: '#FFF',
                            border: 'none',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '12px'
                        }}
                    >
                        Voir les tarifs
                    </button>
                </div>
            )}
        </aside>
    )
}
