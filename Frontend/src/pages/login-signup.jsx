import React, { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useGoogleLogin } from '@react-oauth/google'

import {
    HiUser,
    HiTag,
    HiEnvelope,
    HiAtSymbol,
    HiKey,
    HiLockClosed,
    HiShieldCheck,
    HiExclamationTriangle,
    HiCheck,
    HiXMark,
    HiArrowLeft,
    HiSparkles,
    HiEye,
    HiEyeSlash,
    HiCog6Tooth,
    HiAcademicCap,
    HiBriefcase,
    HiDocumentArrowDown,
    HiCurrencyDollar,
    HiQuestionMarkCircle
} from 'react-icons/hi2'

import { login, signup, googleLoginAction } from '../store/user.actions'
import { httpService } from '../services/http.service'

import logo from '../assets/img/polyspace-logo.png'

// ── Check if Google OAuth is configured ────────────────────────
const IS_GOOGLE_CONFIGURED = !!process.env.REACT_APP_GOOGLE_CLIENT_ID

// ── GoogleLoginButton: only rendered when clientId is set ──────────
function GoogleLoginButton({ onSuccess, onError, disabled }) {
    const triggerLogin = useGoogleLogin({
        onSuccess,
        onError: (err) => { console.error('Google OAuth:', err); onError() },
        flow: 'implicit',
    })
    return (
        <button type="button" className="btn-social" id="btn-google"
            onClick={() => triggerLogin()} disabled={disabled}>
            <GoogleIcon /> Continuer avec Google
        </button>
    )
}

// ── Google SVG Icon ──────────────────────────────────────────
const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
)

// ── Password strength ─────────────────────────────────────────
function getPasswordStrength(password) {
    if (!password) return { score: 0, label: '', color: '', checks: {} }
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        digit: /\d/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    }
    const score = Object.values(checks).filter(Boolean).length
    if (score <= 1) return { score: 1, label: 'Très faible', color: '#EF4444', checks }
    if (score === 2) return { score: 2, label: 'Faible', color: '#F97316', checks }
    if (score === 3) return { score: 3, label: 'Moyen', color: '#EAB308', checks }
    if (score === 4) return { score: 4, label: 'Fort', color: '#22C55E', checks }
    return { score: 5, label: 'Optimal', color: '#10B981', checks }
}

// ── OTP Input ─────────────────────────────────────────────────
function OtpInput({ length = 6, value, onChange }) {
    const inputs = useRef([])
    const digits = value.split('').concat(Array(length).fill('')).slice(0, length)

    function handleKey(e, idx) {
        if (e.key === 'Backspace' && !digits[idx] && idx > 0) inputs.current[idx - 1]?.focus()
    }
    function handleChange(e, idx) {
        const val = e.target.value.replace(/\D/g, '').slice(-1)
        const next = [...digits]
        next[idx] = val
        onChange(next.join(''))
        if (val && idx < length - 1) inputs.current[idx + 1]?.focus()
    }
    function handlePaste(e) {
        e.preventDefault()
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
        onChange(pasted)
        inputs.current[Math.min(pasted.length, length - 1)]?.focus()
    }
    return (
        <div className="otp-inputs" onPaste={handlePaste}>
            {digits.map((d, i) => (
                <input key={i} ref={el => inputs.current[i] = el}
                    type="text" inputMode="numeric" maxLength={1}
                    value={d} onChange={e => handleChange(e, i)} onKeyDown={e => handleKey(e, i)}
                    className={`otp-cell${d ? ' filled' : ''}`} id={`otp-cell-${i}`} />
            ))}
        </div>
    )
}

// ── Main Component ────────────────────────────────────────────
export function LoginSignup() {
    const params = useParams()
    const navigate = useNavigate()
    const [view, setView] = useState(params.status || 'login')
    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showPwd, setShowPwd] = useState(false)
    const [showConfirmPwd, setShowConfirmPwd] = useState(false)

    // Uniqueness states
    const [usernameStatus, setUsernameStatus] = useState(null)
    const [emailStatus, setEmailStatus] = useState(null)
    const usernameTimer = useRef(null)
    const emailTimer = useRef(null)

    // Flow states (Forgot / OTP / Reset)
    const [resetEmail, setResetEmail] = useState('')
    const [otpCode, setOtpCode] = useState('')
    const [devOtp, setDevOtp] = useState('')

    const isSignup = view === 'signup'

    // Formik Validation Schema
    const validationSchema = Yup.object().shape({
        fullname: isSignup
            ? Yup.string().min(2, 'Trop court').required('Requis')
            : Yup.string(),
        username: Yup.string().min(3, 'Min. 3 caractères').required('Requis'),
        email: isSignup
            ? Yup.string().email('Email invalide').required('Requis')
            : Yup.string(),
        password: Yup.string().min(6, 'Min. 6 caractères').required('Requis'),
        confirmPassword: isSignup
            ? Yup.string().oneOf([Yup.ref('password')], 'Mots de passe non identiques').required('Requis')
            : Yup.string(),
    })

    const formik = useFormik({
        initialValues: { fullname: '', username: '', email: '', password: '', confirmPassword: '' },
        validationSchema,
        onSubmit: async (values) => {
            setErrorMsg('')
            setIsLoading(true)
            try {
                if (isSignup) {
                    await signup({
                        fullname: values.fullname,
                        username: values.username,
                        email: values.email,
                        password: values.password,
                        imgUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${values.username}`
                    })
                } else {
                    await login({
                        username: values.username,
                        password: values.password
                    })
                }
                navigate('/workspace')
            } catch (err) {
                setErrorMsg(err?.response?.data?.err || err.message || 'Une erreur est survenue.')
            } finally {
                setIsLoading(false)
            }
        }
    })

    const pwdStrength = getPasswordStrength(formik.values.password)

    function checkUsername(val) {
        clearTimeout(usernameTimer.current)
        if (!val || val.length < 3) { setUsernameStatus(null); return }
        setUsernameStatus('checking')
        usernameTimer.current = setTimeout(async () => {
            try {
                const res = await httpService.get(`auth/check-username/${val}`)
                setUsernameStatus(res.available ? 'available' : 'taken')
            } catch {
                setUsernameStatus(null)
            }
        }, 400)
    }

    function checkEmail(val) {
        clearTimeout(emailTimer.current)
        if (!val || !val.includes('@')) { setEmailStatus(null); return }
        setEmailStatus('checking')
        emailTimer.current = setTimeout(async () => {
            try {
                const res = await httpService.get(`auth/check-email/${val}`)
                setEmailStatus(res.available ? 'available' : 'taken')
            } catch {
                setEmailStatus(null)
            }
        }, 400)
    }

    async function handleDemoLogin() {
        setIsLoading(true)
        setErrorMsg('')
        try {
            await login({ username: 'demo', password: 'demo1234' })
            navigate('/workspace')
        } catch {
            try {
                await signup({
                    fullname: 'Utilisateur Démo',
                    username: 'demo',
                    email: 'demo@polyspace.eps.tn',
                    password: 'demo1234',
                    imgUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo'
                })
                navigate('/workspace')
            } catch (err) {
                setErrorMsg('Connexion démo indisponible.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    async function handleForgotSubmit(e) {
        e.preventDefault()
        const email = e.target.forgotEmail.value
        setIsLoading(true)
        setErrorMsg('')
        try {
            const res = await httpService.post('auth/forgot-password', { email })
            setResetEmail(email)
            if (res.devOtp) setDevOtp(res.devOtp)
            setView('otp')
        } catch (err) {
            setErrorMsg(err?.response?.data?.err || err.message)
        } finally {
            setIsLoading(false)
        }
    }

    async function handleOtpSubmit(e) {
        e.preventDefault()
        if (otpCode.length < 6) { setErrorMsg('Saisissez le code à 6 chiffres.'); return }
        setIsLoading(true)
        setErrorMsg('')
        try {
            await httpService.post('auth/verify-otp', { email: resetEmail, otp: otpCode })
            setView('reset')
        } catch (err) {
            setErrorMsg(err?.response?.data?.err || err.message)
        } finally {
            setIsLoading(false)
        }
    }

    async function handleResetSubmit(e) {
        e.preventDefault()
        const newPassword = e.target.newPassword.value
        const confirm = e.target.confirmNewPassword.value
        if (newPassword !== confirm) { setErrorMsg('Les mots de passe ne correspondent pas.'); return }
        if (newPassword.length < 6) { setErrorMsg('Min. 6 caractères.'); return }
        setIsLoading(true)
        setErrorMsg('')
        try {
            await httpService.post('auth/reset-password', { email: resetEmail, otp: otpCode, newPassword })
            setSuccessMsg('Mot de passe réinitialisé ! Redirection...')
            setTimeout(() => { setView('login'); setSuccessMsg('') }, 2500)
        } catch (err) {
            setErrorMsg(err?.response?.data?.err || err.message)
        } finally {
            setIsLoading(false)
        }
    }

    function AvailabilityBadge({ status }) {
        if (!status) return null
        if (status === 'checking') return <span className="avail-badge checking">⟳</span>
        return status === 'available'
            ? <span className="avail-badge ok"><HiCheck /> Disponible</span>
            : <span className="avail-badge taken"><HiXMark /> Déjà pris</span>
    }

    function PwdRule({ ok, label }) {
        return <span className={`pwd-rule${ok ? ' ok' : ''}`}>{ok ? <HiCheck /> : <HiXMark />} {label}</span>
    }

    function switchView(v) {
        setView(v)
        setErrorMsg('')
        setSuccessMsg('')
        formik.resetForm()
        setUsernameStatus(null)
        setEmailStatus(null)
    }

    return (
        <section className="auth-page">
            <div className="auth-bg">
                <div className="blob blob-1" /><div className="blob blob-2" /><div className="blob blob-3" />
            </div>

            {/* Left branding panel */}
            <aside className="auth-left">
                <div className="auth-brand">
                    <img src={logo} alt="PolySpace" height="36" style={{ borderRadius: '4px' }} />
                    <span className="brand-name" style={{ color: '#FFFFFF', fontWeight: '800' }}>Poly<span style={{ color: '#F58220' }}>Space</span></span>
                    <span className="brand-badge" style={{ backgroundColor: '#F5822022', color: '#F58220', border: '1px solid #F5822055' }}>EPS</span>
                </div>

                <div className="auth-guide">
                    <div className="guide-eyebrow" style={{ color: '#F58220', borderColor: '#F5822033' }}>
                        <HiAcademicCap style={{ marginRight: '4px' }} /> ESPACE ÉTUDIANT · ÉCOLE POLYTECHNIQUE DE SOUSSE
                    </div>
                    <h2>Collaborez, apprenez<br /><span className="gradient-text" style={{ backgroundImage: 'linear-gradient(135deg, #0066B3, #F58220)' }}>et réussissez ensemble.</span></h2>
                    <p className="guide-sub">La plateforme conçue par et pour les étudiants de l'EPS. Projets académiques, stages, examens et entraide — tout en un seul espace.</p>


                    <div className="feature-grid">
                        <div className="feature-card">
                            <div className="fc-icon cyan"><HiQuestionMarkCircle /></div>
                            <div className="fc-content">
                                <strong>PolyOverflow</strong>
                                <span>Forum Q&amp;R code, maths &amp; physique</span>
                            </div>
                        </div>
                        <div className="feature-card">
                            <div className="fc-icon amber"><HiBriefcase /></div>
                            <div className="fc-content">
                                <strong>PolyStages &amp; PFE</strong>
                                <span>Offres de stages vérifiées à Sousse</span>
                            </div>
                        </div>
                        <div className="feature-card">
                            <div className="fc-icon violet"><HiDocumentArrowDown /></div>
                            <div className="fc-content">
                                <strong>PolyDrive</strong>
                                <span>Annales, DS corrigés &amp; résumés de cours</span>
                            </div>
                        </div>
                        <div className="feature-card">
                            <div className="fc-icon pink"><HiCurrencyDollar /></div>
                            <div className="fc-content">
                                <strong>PolyFreelance</strong>
                                <span>Missions rémunérées &amp; projets tech</span>
                            </div>
                        </div>
                    </div>

                    <div className="auth-stats">
                        <div className="stat">
                            <strong style={{ color: '#F58220' }}>100%</strong>
                            <span>Gratuit EPS</span>
                        </div>
                        <div className="stat">
                            <strong style={{ color: '#38BDF8' }}>Prépa &amp; GL</strong>
                            <span>Toutes filières</span>
                        </div>
                        <div className="stat">
                            <strong style={{ color: '#10B981' }}>Hamza K.</strong>
                            <span>Manager EPS</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Right auth panel */}
            <main className="auth-right">
                <div className="auth-card">

                    {/* ══ LOGIN / SIGNUP ══ */}
                    {(view === 'login' || view === 'signup') && (<>
                        <div className="auth-tabs">
                            <button id="tab-login" className={`auth-tab${view === 'login' ? ' active' : ''}`}
                                onClick={() => switchView('login')} type="button">Connexion</button>
                            <button id="tab-signup" className={`auth-tab${view === 'signup' ? ' active' : ''}`}
                                onClick={() => switchView('signup')} type="button">Créer un compte</button>
                            <div className={`tab-indicator ${view}`} />
                        </div>

                        <form onSubmit={formik.handleSubmit} className="auth-form" noValidate>
                            {errorMsg && (
                                <div className="auth-alert error" role="alert">
                                    <HiExclamationTriangle style={{ flexShrink: 0, fontSize: '16px' }} />
                                    <span>{errorMsg}</span>
                                </div>
                            )}

                            {isSignup && (
                                <div className="form-field">
                                    <label htmlFor="fullname"><HiUser style={{ marginRight: '4px' }} /> Nom complet</label>
                                    <input id="fullname" name="fullname" type="text" placeholder="ex: Alexandre Dumas"
                                        value={formik.values.fullname} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                        className={formik.touched.fullname && formik.errors.fullname ? 'input-error' : ''} autoComplete="name" />
                                    {formik.touched.fullname && formik.errors.fullname && <span className="field-error">{formik.errors.fullname}</span>}
                                </div>
                            )}

                            <div className="form-field">
                                <label htmlFor="username">
                                    {isSignup ? <><HiTag style={{ marginRight: '4px' }} /> Nom d'utilisateur</> : <><HiEnvelope style={{ marginRight: '4px' }} /> Email ou nom d'utilisateur</>}
                                </label>
                                <div className="input-with-badge">
                                    <input id="username" name="username" type="text"
                                        placeholder={isSignup ? 'alexandre.d' : 'alexandre.d ou alexandre@email.com'}
                                        value={formik.values.username}
                                        onChange={e => { formik.handleChange(e); if (isSignup) checkUsername(e.target.value) }}
                                        onBlur={formik.handleBlur}
                                        className={formik.touched.username && formik.errors.username ? 'input-error' : ''}
                                        autoComplete={isSignup ? 'username' : 'email'} />
                                    {isSignup && <AvailabilityBadge status={usernameStatus} />}
                                </div>
                                {formik.touched.username && formik.errors.username && <span className="field-error">{formik.errors.username}</span>}
                                {isSignup && usernameStatus === 'taken' && <span className="field-error">Ce nom d'utilisateur est déjà utilisé.</span>}
                            </div>

                            {isSignup && (
                                <div className="form-field">
                                    <label htmlFor="email"><HiAtSymbol style={{ marginRight: '4px' }} /> Adresse email</label>
                                    <div className="input-with-badge">
                                        <input id="email" name="email" type="email" placeholder="alexandre@collabflow.io"
                                            value={formik.values.email}
                                            onChange={e => { formik.handleChange(e); checkEmail(e.target.value) }}
                                            onBlur={formik.handleBlur}
                                            className={formik.touched.email && formik.errors.email ? 'input-error' : ''}
                                            autoComplete="email" />
                                        <AvailabilityBadge status={emailStatus} />
                                    </div>
                                    {formik.touched.email && formik.errors.email && <span className="field-error">{formik.errors.email}</span>}
                                    {emailStatus === 'taken' && <span className="field-error">Cette adresse email est déjà utilisée.</span>}
                                </div>
                            )}

                            <div className="form-field">
                                <div className="label-row">
                                    <label htmlFor="password"><HiKey style={{ marginRight: '4px' }} /> Mot de passe</label>
                                    {!isSignup && (
                                        <button type="button" className="link-btn" onClick={() => switchView('forgot')}>
                                            Mot de passe oublié ?
                                        </button>
                                    )}
                                </div>
                                <div className="password-wrapper">
                                    <input id="password" name="password"
                                        type={showPwd ? 'text' : 'password'}
                                        placeholder={isSignup ? 'Min. 6 caractères' : '••••••••'}
                                        value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                        className={formik.touched.password && formik.errors.password ? 'input-error' : ''}
                                        autoComplete={isSignup ? 'new-password' : 'current-password'} />
                                    <button type="button" className="eye-btn" onClick={() => setShowPwd(v => !v)} tabIndex={-1}>
                                        {showPwd ? <HiEyeSlash style={{ fontSize: '18px' }} /> : <HiEye style={{ fontSize: '18px' }} />}
                                    </button>
                                </div>
                                {isSignup && formik.values.password.length > 0 && (<>
                                    <div className="pwd-strength">
                                        <div className="strength-bar">
                                            {[1,2,3,4,5].map(i => (
                                                <div key={i} className={`bar-seg${pwdStrength.score >= i ? ' active' : ''}`}
                                                    style={{ background: pwdStrength.score >= i ? pwdStrength.color : '' }} />
                                            ))}
                                        </div>
                                        <span style={{ color: pwdStrength.color, fontSize: '12px', fontWeight: 600 }}>{pwdStrength.label}</span>
                                    </div>
                                    <div className="pwd-rules">
                                        <PwdRule ok={pwdStrength.checks?.length} label="8+ car." />
                                        <PwdRule ok={pwdStrength.checks?.uppercase} label="Majuscule" />
                                        <PwdRule ok={pwdStrength.checks?.digit} label="Chiffre" />
                                        <PwdRule ok={pwdStrength.checks?.special} label="Symbole" />
                                    </div>
                                </>)}
                                {formik.touched.password && formik.errors.password && <span className="field-error">{formik.errors.password}</span>}
                            </div>

                            {isSignup && (
                                <div className="form-field">
                                    <label htmlFor="confirmPassword"><HiLockClosed style={{ marginRight: '4px' }} /> Confirmer le mot de passe</label>
                                    <div className="password-wrapper">
                                        <input id="confirmPassword" name="confirmPassword"
                                            type={showConfirmPwd ? 'text' : 'password'} placeholder="••••••••"
                                            value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                            className={formik.touched.confirmPassword && formik.errors.confirmPassword ? 'input-error' : ''}
                                            autoComplete="new-password" />
                                        <button type="button" className="eye-btn" onClick={() => setShowConfirmPwd(v => !v)} tabIndex={-1}>
                                            {showConfirmPwd ? <HiEyeSlash style={{ fontSize: '18px' }} /> : <HiEye style={{ fontSize: '18px' }} />}
                                        </button>
                                    </div>
                                    {formik.touched.confirmPassword && formik.errors.confirmPassword && <span className="field-error">{formik.errors.confirmPassword}</span>}
                                </div>
                            )}

                            {isSignup && (
                                <p className="terms-text">En créant un compte, vous acceptez nos <span className="link-inline">Conditions</span> et notre <span className="link-inline">Politique de confidentialité</span>.</p>
                            )}

                            <button type="submit" className="btn-primary"
                                id={isSignup ? 'btn-signup' : 'btn-login'}
                                disabled={isLoading || (isSignup && (usernameStatus === 'taken' || emailStatus === 'taken'))}>
                                {isLoading && <span className="btn-spinner" />}
                                {isLoading ? 'Chargement...' : (isSignup ? 'Créer mon compte' : 'Se connecter')}
                            </button>

                            <div className="auth-divider"><span>ou</span></div>

                            <div className="social-btns">
                                {IS_GOOGLE_CONFIGURED ? (
                                    <GoogleLoginButton
                                        disabled={isLoading}
                                        onSuccess={async (tokenResponse) => {
                                            setIsLoading(true)
                                            setErrorMsg('')
                                            try {
                                                const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                                                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                                                })
                                                if (!profileRes.ok) throw new Error('Profil Google inaccessible.')
                                                const profile = await profileRes.json()
                                                // Use the Redux action so the store is updated
                                                await googleLoginAction({
                                                    email: profile.email,
                                                    name: profile.name,
                                                    avatar: profile.picture
                                                })
                                                navigate('/workspace')
                                            } catch (err) {
                                                setErrorMsg(err?.response?.data?.err || err.message || 'Connexion Google échouée.')
                                                setIsLoading(false)
                                            }
                                        }}
                                        onError={() => setErrorMsg('Connexion Google annulée ou refusée.')}
                                    />
                                ) : (
                                    <button type="button" className="btn-social" id="btn-google"
                                        onClick={() => setErrorMsg('Ajoutez REACT_APP_GOOGLE_CLIENT_ID dans Frontend/.env — obtenez votre Client ID sur console.cloud.google.com')}>
                                        <GoogleIcon /> Continuer avec Google
                                    </button>
                                )}
                                <button type="button" className="btn-demo" id="btn-demo" onClick={handleDemoLogin} disabled={isLoading}>
                                    <HiSparkles style={{ fontSize: '16px' }} /> Connexion Démo Rapide
                                </button>
                            </div>
                        </form>
                    </>)}

                    {/* ══ FORGOT PASSWORD ══ */}
                    {view === 'forgot' && (
                        <div className="auth-flow-screen">
                            <button className="back-btn" onClick={() => switchView('login')} type="button">
                                <HiArrowLeft /> Retour
                            </button>
                            <div className="flow-icon-wrap violet"><HiEnvelope /></div>
                            <h2>Mot de passe oublié</h2>
                            <p className="flow-sub">Saisissez votre email ou nom d'utilisateur. Vous recevrez un code à 6 chiffres.</p>
                            {errorMsg && (
                                <div className="auth-alert error">
                                    <HiExclamationTriangle style={{ flexShrink: 0, fontSize: '16px' }} />
                                    <span>{errorMsg}</span>
                                </div>
                            )}
                            <form onSubmit={handleForgotSubmit} className="auth-form">
                                <div className="form-field">
                                    <label htmlFor="forgotEmail">Email ou nom d'utilisateur</label>
                                    <input id="forgotEmail" name="forgotEmail" type="text" placeholder="vous@exemple.com" required autoFocus />
                                </div>
                                <button type="submit" className="btn-primary" disabled={isLoading}>
                                    {isLoading ? <span className="btn-spinner" /> : <HiShieldCheck />}
                                    {isLoading ? 'Envoi...' : 'Envoyer le code de sécurité'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* ══ OTP VERIFICATION ══ */}
                    {view === 'otp' && (
                        <div className="auth-flow-screen">
                            <button className="back-btn" onClick={() => { switchView('forgot'); setOtpCode('') }} type="button">
                                <HiArrowLeft /> Retour
                            </button>
                            <div className="flow-icon-wrap success"><HiShieldCheck /></div>
                            <h2>Vérification en 2 étapes</h2>
                            <p className="flow-sub">Code envoyé à <strong>{resetEmail}</strong>. Valable 10 minutes.</p>
                            {devOtp && (
                                <div className="auth-alert info">
                                    <HiCog6Tooth style={{ marginRight: '4px' }} /> <strong>Dev :</strong> code = <strong style={{ letterSpacing: '2px' }}>{devOtp}</strong>
                                </div>
                            )}
                            {errorMsg && (
                                <div className="auth-alert error">
                                    <HiExclamationTriangle style={{ flexShrink: 0, fontSize: '16px' }} />
                                    <span>{errorMsg}</span>
                                </div>
                            )}
                            <form onSubmit={handleOtpSubmit} className="auth-form">
                                <div className="form-field" style={{ alignItems: 'center' }}>
                                    <label>Code de sécurité à 6 chiffres</label>
                                    <OtpInput length={6} value={otpCode} onChange={setOtpCode} />
                                </div>
                                <button type="submit" className="btn-primary" disabled={isLoading || otpCode.length < 6}>
                                    {isLoading && <span className="btn-spinner" />}
                                    {isLoading ? 'Vérification...' : 'Confirmer le code'}
                                </button>
                            </form>
                            <button className="link-btn center-link" type="button"
                                onClick={() => { setOtpCode(''); setErrorMsg('') }}>
                                Renvoyer le code
                            </button>
                        </div>
                    )}

                    {/* ══ RESET PASSWORD ══ */}
                    {view === 'reset' && (
                        <div className="auth-flow-screen">
                            <div className="flow-icon-wrap success"><HiShieldCheck /></div>
                            <h2>Nouveau mot de passe</h2>
                            <p className="flow-sub">Choisissez un mot de passe fort pour sécuriser votre compte.</p>
                            {errorMsg && (
                                <div className="auth-alert error">
                                    <HiExclamationTriangle style={{ flexShrink: 0, fontSize: '16px' }} />
                                    <span>{errorMsg}</span>
                                </div>
                            )}
                            {successMsg && (
                                <div className="auth-alert success">
                                    <HiCheck style={{ flexShrink: 0, fontSize: '16px' }} />
                                    <span>{successMsg}</span>
                                </div>
                            )}
                            <form onSubmit={handleResetSubmit} className="auth-form">
                                <div className="form-field">
                                    <label htmlFor="newPassword">Nouveau mot de passe</label>
                                    <div className="password-wrapper">
                                        <input id="newPassword" name="newPassword"
                                            type={showPwd ? 'text' : 'password'} placeholder="Min. 6 caractères" required minLength={6} autoFocus />
                                        <button type="button" className="eye-btn" onClick={() => setShowPwd(v => !v)} tabIndex={-1}>
                                            {showPwd ? <HiEyeSlash style={{ fontSize: '18px' }} /> : <HiEye style={{ fontSize: '18px' }} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="form-field">
                                    <label htmlFor="confirmNewPassword">Confirmer le mot de passe</label>
                                    <div className="password-wrapper">
                                        <input id="confirmNewPassword" name="confirmNewPassword"
                                            type={showConfirmPwd ? 'text' : 'password'} placeholder="••••••••" required />
                                        <button type="button" className="eye-btn" onClick={() => setShowConfirmPwd(v => !v)} tabIndex={-1}>
                                            {showConfirmPwd ? <HiEyeSlash style={{ fontSize: '18px' }} /> : <HiEye style={{ fontSize: '18px' }} />}
                                        </button>
                                    </div>
                                </div>
                                <button type="submit" className="btn-primary" disabled={isLoading}>
                                    {isLoading && <span className="btn-spinner" />}
                                    {isLoading ? 'Enregistrement...' : <><HiKey style={{ marginRight: '6px' }} /> Réinitialiser le mot de passe</>}
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="auth-card-footer">
                        <span><HiLockClosed style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} /> Connexion sécurisée SSL · PolySpace EPS © 2026 — Projet de Hamza Khaled</span>
                    </div>
                </div>
            </main>
        </section>
    )
}
