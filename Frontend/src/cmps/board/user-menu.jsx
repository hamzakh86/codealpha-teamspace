import React, { useRef, useState } from 'react'
import { useClickOutside } from '../../customHooks/is-clicked-outside'
import { themeService } from '../../services/theme.service'

import { IoClose, IoMoon, IoSunny } from 'react-icons/io5'
import {
    HiUser,
    HiArrowRightOnRectangle
} from 'react-icons/hi2'

export function UserMenu({ user, onLogout, closeUserMenu, onOpenProfile }) {
    const modalRef = useRef()
    useClickOutside(modalRef, closeUserMenu)

    const [currentTheme, setCurrentTheme] = useState(themeService.getTheme())

    function handleToggleTheme() {
        const next = themeService.toggleTheme()
        setCurrentTheme(next)
    }

    const dispoMap = {
        DISPONIBLE: { label: 'Disponible', color: '#10B981', bg: '#10B98122' },
        STAGE: { label: 'En stage', color: '#F59E0B', bg: '#F59E0B22' },
        REVISIONS: { label: 'En révision DS', color: '#38BDF8', bg: '#38BDF822' },
        OCCUPE: { label: 'Occupé', color: '#EF4444', bg: '#EF444422' }
    }
    const dispo = dispoMap[user?.disponibilite] || dispoMap.DISPONIBLE

    return (
        <section className="user-menu" ref={modalRef} style={{ width: '270px' }}>
            <div className="user-menu-header">
                <h2>Compte PolySpace EPS</h2>
                <button className="btn-user-menu close" onClick={closeUserMenu}>
                    <IoClose className="icon-close" />
                </button>
            </div>

            <div className="user-menu-content">
                {/* User preview */}
                <div className="user-menu-preview" style={{ padding: '8px 4px 12px' }}>
                    <div className="user-img" style={{ position: 'relative' }}>
                        <img
                            src={user?.imgUrl}
                            alt=""
                            style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '50%',
                                border: '2px solid #0066B3'
                            }}
                        />
                        <span style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: dispo.color,
                            border: '2px solid #0F172A'
                        }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div className="user-name" style={{ fontWeight: '700', fontSize: '13.5px', color: '#F8FAFC' }}>
                            {user?.fullname || 'Étudiant'}
                        </div>
                        <span style={{ fontSize: '11px', color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user?.filiere || 'Polytechnique Sousse'}
                        </span>
                        <div style={{ marginTop: '4px' }}>
                            <span style={{
                                fontSize: '10px',
                                fontWeight: '700',
                                padding: '2px 7px',
                                borderRadius: '99px',
                                backgroundColor: dispo.bg,
                                color: dispo.color,
                                border: `1px solid ${dispo.color}44`
                            }}>
                                • {dispo.label}
                            </span>
                        </div>
                    </div>
                </div>

                <hr className="user-menu-separator" style={{ borderColor: '#1E293B', margin: '4px 0 8px' }} />

                {/* Profile & Settings Action */}
                <button
                    className="user-menu-item-btn"
                    onClick={() => {
                        closeUserMenu()
                        if (onOpenProfile) onOpenProfile()
                    }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'transparent',
                        color: '#E2E8F0',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1E293B'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <HiUser style={{ fontSize: '16px', color: '#0066B3' }} />
                    <span>Mon Profil &amp; Paramètres</span>
                </button>

                {/* Quick Theme Toggle */}
                <button
                    className="user-menu-item-btn"
                    onClick={handleToggleTheme}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'transparent',
                        color: '#E2E8F0',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1E293B'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {currentTheme === 'dark' ? (
                            <IoMoon style={{ fontSize: '16px', color: '#38BDF8' }} />
                        ) : (
                            <IoSunny style={{ fontSize: '16px', color: '#F58220' }} />
                        )}
                        <span>{currentTheme === 'dark' ? 'Mode Sombre' : 'Mode Clair'}</span>
                    </div>
                    <span style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase' }}>Bascule</span>
                </button>

                <hr className="user-menu-separator" style={{ borderColor: '#1E293B', margin: '8px 0' }} />

                {/* Logout */}
                <button
                    className="user-menu-logout"
                    onClick={onLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1px solid #EF444433',
                        background: '#EF444411',
                        color: '#EF4444',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EF444422'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#EF444411'}
                >
                    <HiArrowRightOnRectangle style={{ fontSize: '16px' }} />
                    <span>Déconnexion</span>
                </button>
            </div>
        </section>
    )
}