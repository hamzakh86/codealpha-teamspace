import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { userService } from '../../services/user.service'
import { updateUserAction, deleteAccountAction } from '../../store/user.actions'
import { themeService } from '../../services/theme.service'

import {
    HiUser,
    HiSparkles,
    HiBell,
    HiLockClosed,
    HiAcademicCap,
    HiCheck,
    HiExclamationTriangle,
    HiEye,
    HiEyeSlash,
    HiTrash
} from 'react-icons/hi2'
import { IoMoon, IoSunny, IoClose } from 'react-icons/io5'

const AVATAR_PRESETS = [
    { label: 'Hamza', seed: 'hamza' },
    { label: 'Nour', seed: 'nour' },
    { label: 'Youssef', seed: 'youssef' },
    { label: 'Aziz', seed: 'aziz' },
    { label: 'Sarah', seed: 'sarah' },
    { label: 'Alex', seed: 'alex' },
    { label: 'Ingénieur', seed: 'engineer' },
    { label: 'Poly', seed: 'polytech' },
]

const FILIERES_EPS = [
    'Cycle Préparatoire Intégré (Prépa 1)',
    'Cycle Préparatoire Intégré (Prépa 2)',
    'Génie Logiciel & Informatique (GL)',
    'Mécatronique & Robotique',
    'Électromécanique & Systèmes Énergétiques',
    'Télécommunications & Réseaux',
    'Génie Civil & Environnement'
]

const DISPO_OPTIONS = [
    {
        id: 'DISPONIBLE',
        label: 'Disponible pour projets & PFE',
        color: '#10B981',
        dotClass: 'green',
        desc: 'Ouvert au travail d\'équipe, PFA ou recherche de stage'
    },
    {
        id: 'STAGE',
        label: 'En stage d\'entreprise',
        color: '#F59E0B',
        dotClass: 'yellow',
        desc: 'En cours de stage d\'immersion, technicien ou PFE'
    },
    {
        id: 'REVISIONS',
        label: 'En période de révision / DS',
        color: '#38BDF8',
        dotClass: 'blue',
        desc: 'Préparation active des examens semestriels'
    },
    {
        id: 'OCCUPE',
        label: 'Occupé / Non disponible',
        color: '#EF4444',
        dotClass: 'red',
        desc: 'Consacré à d\'autres engagements universitaires'
    }
]

export function ProfileSettingsModal({ isOpen, onClose }) {
    const user = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState('profile') // 'profile' | 'appearance' | 'notifications' | 'security'

    // Form state: Profile
    const [fullname, setFullname] = useState('')
    const [email, setEmail] = useState('')
    const [imgUrl, setImgUrl] = useState('')
    const [filiere, setFiliere] = useState('')
    const [disponibilite, setDisponibilite] = useState('DISPONIBLE')
    const [bio, setBio] = useState('')
    const [github, setGithub] = useState('')
    const [linkedin, setLinkedin] = useState('')
    const [phone, setPhone] = useState('')

    // Form state: Appearance
    const [currentTheme, setCurrentTheme] = useState('dark')

    // Form state: Notifications
    const [notifChannels, setNotifChannels] = useState(true)
    const [notifStages, setNotifStages] = useState(true)
    const [notifTasks, setNotifTasks] = useState(true)
    const [notifEmail, setNotifEmail] = useState(false)

    // Form state: Password Change
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPasswords, setShowPasswords] = useState(false)
    const [pwdMsg, setPwdMsg] = useState(null)
    const [pwdError, setPwdError] = useState(null)

    // Delete Account Modal State
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleteConfirmText, setDeleteConfirmText] = useState('')

    // Feedback states
    const [saveStatus, setSaveStatus] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Load initial user data into form
    useEffect(() => {
        if (user) {
            setFullname(user.fullname || user.name || '')
            setEmail(user.email || '')
            setImgUrl(user.imgUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username || 'poly'}`)
            setFiliere(user.filiere || 'Génie Logiciel & Informatique (GL)')
            setDisponibilite(user.disponibilite || 'DISPONIBLE')
            setBio(user.bio || '')
            setGithub(user.github || '')
            setLinkedin(user.linkedin || '')
            setPhone(user.phone || '')

            const prefs = user.notifications || {}
            setNotifChannels(prefs.channels !== false)
            setNotifStages(prefs.stages !== false)
            setNotifTasks(prefs.tasks !== false)
            setNotifEmail(prefs.email === true)
        }
        setCurrentTheme(themeService.getTheme())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?._id, isOpen])

    if (!isOpen) return null

    // Handlers
    async function handleSaveProfile(e) {
        e.preventDefault()
        setIsSubmitting(true)
        setSaveStatus(null)

        const updatedUser = {
            ...user,
            _id: user._id,
            fullname: fullname.trim(),
            email: email.trim(),
            imgUrl: imgUrl.trim(),
            filiere,
            disponibilite,
            bio: bio.trim(),
            github: github.trim(),
            linkedin: linkedin.trim(),
            phone: phone.trim(),
            notifications: {
                channels: notifChannels,
                stages: notifStages,
                tasks: notifTasks,
                email: notifEmail
            }
        }

        try {
            await updateUserAction(updatedUser)
            setSaveStatus({ type: 'success', text: 'Profil mis à jour avec succès !' })
            setTimeout(() => setSaveStatus(null), 3500)
        } catch (err) {
            setSaveStatus({ type: 'error', text: 'Erreur lors de la sauvegarde du profil.' })
        } finally {
            setIsSubmitting(false)
        }
    }

    function handleSelectPreset(seed) {
        const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
        setImgUrl(url)
    }

    function handleChangeTheme(theme) {
        themeService.setTheme(theme)
        setCurrentTheme(theme)
    }

    async function handleChangePassword(e) {
        e.preventDefault()
        setPwdMsg(null)
        setPwdError(null)

        if (newPassword !== confirmPassword) {
            setPwdError('Les nouveaux mots de passe ne correspondent pas.')
            return
        }
        if (newPassword.length < 6) {
            setPwdError('Le mot de passe doit contenir au moins 6 caractères.')
            return
        }

        setIsSubmitting(true)
        try {
            await userService.changePassword(user._id, oldPassword, newPassword)
            setPwdMsg('Mot de passe changé avec succès !')
            setOldPassword('')
            setNewPassword('')
            setConfirmPassword('')
            setTimeout(() => setPwdMsg(null), 4000)
        } catch (err) {
            setPwdError(err.response?.data?.err || err.message || 'Erreur lors du changement de mot de passe.')
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleDeleteAccount() {
        if (deleteConfirmText.toLowerCase() !== 'supprimer') {
            alert('Veuillez taper "SUPPRIMER" pour confirmer.')
            return
        }

        try {
            await deleteAccountAction(user._id)
            onClose()
            navigate('/')
        } catch (err) {
            alert('Erreur lors de la suppression du compte.')
        }
    }

    const currentDispo = DISPO_OPTIONS.find(d => d.id === disponibilite) || DISPO_OPTIONS[0]

    return (
        <div className="profile-settings-overlay" onClick={onClose}>
            <div className="profile-settings-modal" onClick={e => e.stopPropagation()}>

                {/* ── MODAL HEADER ──────────────────────── */}
                <div className="modal-header">
                    <div className="header-title-block">
                        <div className="badge-eps">POLYSPACE EPS</div>
                        <h2>Profil &amp; Paramètres</h2>
                        <span className="user-subtitle">
                            {user.fullname || 'Étudiant'} · {filiere}
                        </span>
                    </div>
                    <button className="btn-close-modal" onClick={onClose}>
                        <IoClose />
                    </button>
                </div>

                {/* ── MODAL BODY (Sidebar + Content) ────── */}
                <div className="modal-body-layout">

                    {/* Left Tabs Nav */}
                    <nav className="modal-tabs-sidebar">
                        <button
                            className={`tab-item ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <HiUser className="tab-icon" />
                            <span>Mon Profil EPS</span>
                        </button>
                        <button
                            className={`tab-item ${activeTab === 'appearance' ? 'active' : ''}`}
                            onClick={() => setActiveTab('appearance')}
                        >
                            <HiSparkles className="tab-icon" />
                            <span>Apparence &amp; Thème</span>
                        </button>
                        <button
                            className={`tab-item ${activeTab === 'notifications' ? 'active' : ''}`}
                            onClick={() => setActiveTab('notifications')}
                        >
                            <HiBell className="tab-icon" />
                            <span>Notifications</span>
                        </button>
                        <button
                            className={`tab-item ${activeTab === 'security' ? 'active' : ''}`}
                            onClick={() => setActiveTab('security')}
                        >
                            <HiLockClosed className="tab-icon" />
                            <span>Sécurité &amp; Compte</span>
                        </button>

                        <div className="sidebar-status-card">
                            <span className="status-label">Statut Actuel</span>
                            <div className="status-indicator">
                                <span className={`status-dot ${currentDispo.dotClass}`} />
                                <strong style={{ color: currentDispo.color }}>{currentDispo.label}</strong>
                            </div>
                        </div>
                    </nav>

                    {/* Main Content Panels */}
                    <div className="modal-content-panel">

                        {saveStatus && (
                            <div className={`alert-banner ${saveStatus.type}`}>
                                {saveStatus.type === 'success' ? <HiCheck /> : <HiExclamationTriangle />}
                                <span>{saveStatus.text}</span>
                            </div>
                        )}

                        {/* ── TAB 1 : PROFIL ÉTUDIANT ────────────── */}
                        {activeTab === 'profile' && (
                            <form onSubmit={handleSaveProfile} className="settings-form">
                                <div className="section-title">
                                    <h3>Informations Personnelles &amp; Académiques</h3>
                                    <p>Ces informations sont visibles par vos camarades et tuteurs sur les tableaux et salons.</p>
                                </div>

                                {/* Avatar section */}
                                <div className="avatar-picker-section">
                                    <div className="avatar-preview-wrap">
                                        <img src={imgUrl} alt={fullname} className="current-avatar-preview" />
                                        <span className={`avatar-status-badge ${currentDispo.dotClass}`} />
                                    </div>
                                    <div className="avatar-controls">
                                        <label className="field-label">Choisir un avatar d'ingénieur</label>
                                        <div className="presets-row">
                                            {AVATAR_PRESETS.map((p, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    className="preset-avatar-btn"
                                                    onClick={() => handleSelectPreset(p.seed)}
                                                    title={p.label}
                                                >
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.seed}`} alt={p.label} />
                                                </button>
                                            ))}
                                        </div>
                                        <input
                                            type="text"
                                            className="form-input custom-url-input"
                                            placeholder="Ou collez une URL d'image personnalisée..."
                                            value={imgUrl}
                                            onChange={e => setImgUrl(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Name & Email */}
                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label className="field-label">Nom Complet *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={fullname}
                                            onChange={e => setFullname(e.target.value)}
                                            placeholder="ex: Hamza Khaled"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="field-label">Email Universitaire / Personnel</label>
                                        <input
                                            type="email"
                                            className="form-input"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="ex: hamza.khaled@polytechnique.sousse.tn"
                                        />
                                    </div>
                                </div>

                                {/* Filière & Disponibilité */}
                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label className="field-label">
                                            <HiAcademicCap style={{ marginRight: '4px' }} /> Filière à l'EPS
                                        </label>
                                        <select
                                            className="form-select"
                                            value={filiere}
                                            onChange={e => setFiliere(e.target.value)}
                                        >
                                            {FILIERES_EPS.map((f, i) => (
                                                <option key={i} value={f}>{f}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="field-label">Statut de Disponibilité</label>
                                        <select
                                            className="form-select"
                                            value={disponibilite}
                                            onChange={e => setDisponibilite(e.target.value)}
                                        >
                                            {DISPO_OPTIONS.map(d => (
                                                <option key={d.id} value={d.id}>{d.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="form-group">
                                    <label className="field-label">Bio / Objectifs Académiques &amp; PFE</label>
                                    <textarea
                                        className="form-textarea"
                                        rows={3}
                                        value={bio}
                                        onChange={e => setBio(e.target.value)}
                                        placeholder="Décrivez brièvement vos compétences, projets en cours ou sujet de stage recherché..."
                                    />
                                </div>

                                {/* Social links */}
                                <div className="form-row-3">
                                    <div className="form-group">
                                        <label className="field-label">GitHub</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={github}
                                            onChange={e => setGithub(e.target.value)}
                                            placeholder="github.com/hamzakh"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="field-label">LinkedIn</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={linkedin}
                                            onChange={e => setLinkedin(e.target.value)}
                                            placeholder="linkedin.com/in/hamzakh"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="field-label">Téléphone</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            placeholder="+216 99 123 456"
                                        />
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn-save" disabled={isSubmitting}>
                                        {isSubmitting ? 'Enregistrement...' : 'Enregistrer mon Profil'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* ── TAB 2 : APPARENCE & THÈME ─────────── */}
                        {activeTab === 'appearance' && (
                            <div className="settings-section">
                                <div className="section-title">
                                    <h3>Thème &amp; Préférences Visuelles</h3>
                                    <p>Choisissez l'apparence de PolySpace selon votre environnement de travail.</p>
                                </div>

                                <div className="theme-switcher-grid">
                                    <div
                                        className={`theme-card ${currentTheme === 'dark' ? 'selected' : ''}`}
                                        onClick={() => handleChangeTheme('dark')}
                                    >
                                        <div className="theme-preview dark-preview">
                                            <div className="preview-top-bar" />
                                            <div className="preview-column">
                                                <div className="preview-card-line" />
                                                <div className="preview-card-line short" />
                                            </div>
                                        </div>
                                        <div className="theme-info">
                                            <div className="theme-name">
                                                <IoMoon style={{ color: '#38BDF8', marginRight: '6px' }} />
                                                <strong>Mode Sombre (PolyDark)</strong>
                                            </div>
                                            <p>Palette contrastée avec les bleus profonds et l'orange officiel de l'école.</p>
                                        </div>
                                        {currentTheme === 'dark' && <span className="selected-pill"><HiCheck /> Actif</span>}
                                    </div>

                                    <div
                                        className={`theme-card ${currentTheme === 'light' ? 'selected' : ''}`}
                                        onClick={() => handleChangeTheme('light')}
                                    >
                                        <div className="theme-preview light-preview">
                                            <div className="preview-top-bar" />
                                            <div className="preview-column">
                                                <div className="preview-card-line" />
                                                <div className="preview-card-line short" />
                                            </div>
                                        </div>
                                        <div className="theme-info">
                                            <div className="theme-name">
                                                <IoSunny style={{ color: '#F58220', marginRight: '6px' }} />
                                                <strong>Mode Simple / Clair (PolyLight)</strong>
                                            </div>
                                            <p>Affichage lumineux et épuré pour les salles de cours et présentations.</p>
                                        </div>
                                        {currentTheme === 'light' && <span className="selected-pill"><HiCheck /> Actif</span>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── TAB 3 : NOTIFICATIONS ─────────────── */}
                        {activeTab === 'notifications' && (
                            <div className="settings-section">
                                <div className="section-title">
                                    <h3>Préférences de Notifications</h3>
                                    <p>Gérez les alertes que vous souhaitez recevoir sur PolySpace.</p>
                                </div>

                                <div className="notifications-list">
                                    <div className="notif-row">
                                        <div className="notif-info">
                                            <strong>Salons d'Échange PolySpace</strong>
                                            <p>Recevoir les notifications de nouveaux messages sur #polyoverflow et les salons actifs.</p>
                                        </div>
                                        <label className="switch-wrapper">
                                            <input
                                                type="checkbox"
                                                checked={notifChannels}
                                                onChange={e => setNotifChannels(e.target.checked)}
                                            />
                                            <span className="switch-slider" />
                                        </label>
                                    </div>

                                    <div className="notif-row">
                                        <div className="notif-info">
                                            <strong>Alertes Stages &amp; PFE</strong>
                                            <p>Être notifié immédiatement lorsqu'une nouvelle offre de stage ou PFE est publiée.</p>
                                        </div>
                                        <label className="switch-wrapper">
                                            <input
                                                type="checkbox"
                                                checked={notifStages}
                                                onChange={e => setNotifStages(e.target.checked)}
                                            />
                                            <span className="switch-slider" />
                                        </label>
                                    </div>

                                    <div className="notif-row">
                                        <div className="notif-info">
                                            <strong>Rappels des Tâches &amp; Projets</strong>
                                            <p>Recevoir un rappel pour les dates d'échéances des devoirs et projets académiques.</p>
                                        </div>
                                        <label className="switch-wrapper">
                                            <input
                                                type="checkbox"
                                                checked={notifTasks}
                                                onChange={e => setNotifTasks(e.target.checked)}
                                            />
                                            <span className="switch-slider" />
                                        </label>
                                    </div>

                                    <div className="notif-row">
                                        <div className="notif-info">
                                            <strong>Notification par Email</strong>
                                            <p>Recevoir un résumé hebdomadaire de l'activité sur votre adresse email.</p>
                                        </div>
                                        <label className="switch-wrapper">
                                            <input
                                                type="checkbox"
                                                checked={notifEmail}
                                                onChange={e => setNotifEmail(e.target.checked)}
                                            />
                                            <span className="switch-slider" />
                                        </label>
                                    </div>
                                </div>

                                <div className="form-actions" style={{ marginTop: '24px' }}>
                                    <button type="button" className="btn-save" onClick={handleSaveProfile}>
                                        Sauvegarder les Préférences
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── TAB 4 : SÉCURITÉ & COMPTE ─────────── */}
                        {activeTab === 'security' && (
                            <div className="settings-section">
                                <div className="section-title">
                                    <h3>Sécurité du Compte Étudiant</h3>
                                    <p>Modifiez votre mot de passe ou gérez l'accès à votre compte.</p>
                                </div>

                                {pwdMsg && (
                                    <div className="alert-banner success">
                                        <HiCheck /> <span>{pwdMsg}</span>
                                    </div>
                                )}
                                {pwdError && (
                                    <div className="alert-banner error">
                                        <HiExclamationTriangle /> <span>{pwdError}</span>
                                    </div>
                                )}

                                <form onSubmit={handleChangePassword} className="password-form">
                                    <div className="form-group">
                                        <label className="field-label">Mot de passe actuel</label>
                                        <div className="password-input-wrap">
                                            <input
                                                type={showPasswords ? 'text' : 'password'}
                                                className="form-input"
                                                value={oldPassword}
                                                onChange={e => setOldPassword(e.target.value)}
                                                placeholder="Saisissez votre mot de passe actuel..."
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="btn-toggle-pwd"
                                                onClick={() => setShowPasswords(!showPasswords)}
                                            >
                                                {showPasswords ? <HiEyeSlash /> : <HiEye />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="form-row-2">
                                        <div className="form-group">
                                            <label className="field-label">Nouveau mot de passe</label>
                                            <input
                                                type={showPasswords ? 'text' : 'password'}
                                                className="form-input"
                                                value={newPassword}
                                                onChange={e => setNewPassword(e.target.value)}
                                                placeholder="Au moins 6 caractères..."
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="field-label">Confirmer le nouveau mot de passe</label>
                                            <input
                                                type={showPasswords ? 'text' : 'password'}
                                                className="form-input"
                                                value={confirmPassword}
                                                onChange={e => setConfirmPassword(e.target.value)}
                                                placeholder="Confirmez à l'identique..."
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" className="btn-secondary" disabled={isSubmitting}>
                                        {isSubmitting ? 'Mise à jour...' : 'Modifier mon mot de passe'}
                                    </button>
                                </form>

                                {/* DANGER ZONE */}
                                <div className="danger-zone-card">
                                    <div className="danger-content">
                                        <h4>Zone de Danger · Suppression de Compte</h4>
                                        <p>La suppression de votre compte effacera définitivement votre profil, vos accès aux tableaux et votre historique dans les salons PolySpace.</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-danger"
                                        onClick={() => setShowDeleteConfirm(true)}
                                    >
                                        <HiTrash style={{ marginRight: '6px' }} /> Supprimer mon compte
                                    </button>
                                </div>

                                {showDeleteConfirm && (
                                    <div className="delete-confirm-box">
                                        <p style={{ color: '#EF4444', fontWeight: '700', marginBottom: '8px' }}>
                                            Action irréversible ! Veuillez taper "SUPPRIMER" pour confirmer :
                                        </p>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <input
                                                type="text"
                                                className="form-input"
                                                style={{ maxWidth: '200px' }}
                                                value={deleteConfirmText}
                                                onChange={e => setDeleteConfirmText(e.target.value)}
                                                placeholder="SUPPRIMER"
                                            />
                                            <button
                                                type="button"
                                                className="btn-danger"
                                                onClick={handleDeleteAccount}
                                            >
                                                Confirmer la suppression
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-secondary"
                                                onClick={() => setShowDeleteConfirm(false)}
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </div>
    )
}
