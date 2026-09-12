import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { HomePageFooter } from '../cmps/home-page/home-page-footer'
import polyLogo from '../assets/img/polyspace-logo.png'
import polyCampus from '../assets/img/poly-campus.jpg'

import {
    HiBolt,
    HiAcademicCap,
    HiStar,
    HiBriefcase,
    HiPlay,
    HiCheck,
    HiQuestionMarkCircle,
    HiArrowRight,
    HiChatBubbleLeftRight,
    HiDocumentArrowDown,
    HiCurrencyDollar,
    HiUserGroup
} from 'react-icons/hi2'

export function HomePage() {
    const [activeTab, setActiveTab] = useState('overflow')

    const stats = [
        { value: '100% Gratuit', label: 'Pour tous les étudiants EPS', icon: <HiAcademicCap /> },
        { value: 'Prépa & Ingénieur', label: 'Toutes les filières réunies', icon: <HiUserGroup /> },
        { value: '4 Salons Clés', label: 'Stages, Code, Examens & Freelance', icon: <HiChatBubbleLeftRight /> },
        { value: 'Directeur Projet', label: 'Hamza Khaled (EPS)', icon: <HiStar /> },
    ]

    const specialties = [
        'Cycle Préparatoire Intégré',
        'Génie Logiciel & Informatique',
        'Mécatronique & Robotique',
        'Électromécanique & Énergie',
        'Télécommunications & Réseaux',
        'Génie Civil & Environnement'
    ]

    const features = [
        {
            id: 'overflow',
            icon: <HiQuestionMarkCircle />,
            tabTitle: 'PolyOverflow (Q&R)',
            title: 'Le StackOverflow officiel de Polytechnique Sousse',
            desc: 'Posez vos questions de code (C, Python, Java, MATLAB), algorithmique, mathématiques ou physique. Votez pour les meilleures réponses et échangez avec vos camarades de classe.',
            badge: 'Entraide Académique',
            bullets: [
                'Coloration syntaxique pour tous les langages enseignés à l’école',
                'Votes communautaires pour certifier les réponses les plus précises',
                'Filtres par module : Analyse, Algèbre, BDD, IA, IoT, Embarqué'
            ]
        },
        {
            id: 'stages',
            icon: <HiBriefcase />,
            tabTitle: 'PolyStages & PFE',
            title: 'Le tremplin vers votre stage d’été, PFA et PFE',
            desc: 'Trouvez et partagez des offres de stages vérifiées à Sousse (Novation City, Technopôle, Sahloul), en Tunisie et à l’international. Bénéficiez des retours d’expérience des anciens.',
            badge: 'Carrière & PFE',
            bullets: [
                'Offres de stages d’immersion, ouvrier, technicien et projets de fin d’études',
                'Fiches d’évaluation d’entreprises partagées par les étudiants de l’EPS',
                'Conseils pour la rédaction du rapport et la soutenance orale'
            ]
        },
        {
            id: 'drive',
            icon: <HiDocumentArrowDown />,
            tabTitle: 'PolyDrive (Examens)',
            title: 'Banque collaborative d’annales, DS et résumés de cours',
            desc: 'Préparez vos devoirs surveillés et examens semestriels avec l’archive numérique des épreuves passées, les corrigés détaillés et les résumés rédigés par les majors de promotion.',
            badge: 'Révision & Succès',
            bullets: [
                'Annales des DS et examens des 5 dernières années classées par semestre',
                'Séries de TD/TP avec corrigés certifiés par les étudiants',
                'Fiches mémos et synthèses pour les semaines de révision'
            ]
        },
        {
            id: 'freelance',
            icon: <HiCurrencyDollar />,
            tabTitle: 'PolyFreelance',
            title: 'Missions rémunérées & premiers pas dans le monde pro',
            desc: 'Développez vos compétences en participant à des projets réels. Les étudiants publient et trouvent des missions freelance en développement web, mobile, UI/UX ou électronique.',
            badge: 'Opportunités Rémunérées',
            bullets: [
                'Missions de création de sites web, applications mobiles et dashboards',
                'Formation d’équipes multidisciplinaires pour candidater à des appels à projets',
                'Mise en relation avec des startups locales et le réseau alumni'
            ]
        }
    ]

    const testimonials = [
        {
            text: "PolySpace a transformé nos révisions de prépa ! Avoir les annales corrigées et le forum PolyOverflow nous a fait gagner un temps précieux pour valider les semestres.",
            author: "Youssef Trabelsi",
            role: "Élève en 2ème année Préparatoire Intégrée",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=youssef"
        },
        {
            text: "J'ai trouvé mon stage PFE à Novation City grâce au canal PolyStages. C'est l'outil communautaire qui manquait vraiment aux étudiants de Polytechnique Sousse.",
            author: "Nour Ben Salem",
            role: "Élève-Ingénieure 3ème année Génie Logiciel",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nour"
        },
        {
            text: "Bravo à Hamza Khaled pour cette superbe plateforme. La gestion des tableaux pour nos mini-projets avec la synchronisation live rend le travail en groupe ultra efficace.",
            author: "Mohamed Aziz Ghariani",
            role: "Membre du Club Robotique EPS",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aziz"
        }
    ]

    const activeFeature = features.find(f => f.id === activeTab) || features[0]

    return (
        <section className="home-page jira-inspired-theme polyspace-theme">

            {/* ── HERO SECTION ─────────────────────────── */}
            <div className="bg-gradient-hero">
                <section className="hero-section">
                    <div className="hero-content">

                        {/* Campus & Manager Badge */}
                        <div className="hero-ai-badge polyspace-badge">
                            <span className="badge-sparkle"><HiAcademicCap /></span>
                            <span className="badge-text">Plateforme Officielle · École Polytechnique de Sousse</span>
                            <span className="badge-pill" style={{ backgroundColor: '#F58220', color: '#FFF' }}>100% Gratuit</span>
                        </div>

                        {/* Main Title */}
                        <h1 className="hero-main-title">
                            L'espace collaboratif d'excellence pour les <span className="highlight-text" style={{ color: '#F58220' }}>étudiants prépa</span> & <span className="highlight-realtime" style={{ color: '#38BDF8' }}>élèves-ingénieurs</span> de Polytechnique Sousse.
                        </h1>

                        {/* Subtitle */}
                        <p className="hero-sub-title">
                            Organisez vos projets académiques, trouvez votre stage d'été ou PFE, révisez vos examens et échangez sur <strong>PolyOverflow</strong>. Projet fondé et administré par <strong>Hamza Khaled</strong> pour toute la communauté EPS.
                        </p>

                        {/* CTA Group */}
                        <div className="hero-cta-group">
                            <Link to="/workspace" className="btn-jira-primary" style={{ backgroundColor: '#0066B3', borderColor: '#0066B3' }}>
                                Accéder à mon Espace PolySpace <HiArrowRight style={{ fontSize: '16px' }} />
                            </Link>
                            <Link to="/watch-demo" className="btn-jira-secondary">
                                <span className="play-icon"><HiPlay /></span> Découvrir les fonctionnalités
                            </Link>
                        </div>

                        {/* Trust checkmarks */}
                        <div className="hero-trust-bar">
                            <div className="trust-item">
                                <span className="check-icon"><HiCheck /></span> Gratuit pour tous les étudiants EPS
                            </div>
                            <div className="trust-item">
                                <span className="check-icon"><HiCheck /></span> Canaux Stages, Code & Examens
                            </div>
                            <div className="trust-item">
                                <span className="check-icon"><HiCheck /></span> Gestionnaire : Hamza Khaled
                            </div>
                        </div>
                    </div>

                    {/* ── CAMPUS PHOTO & BOARD SHOWCASE ── */}
                    <div className="hero-board-showcase polyspace-showcase">
                        <div className="board-window-frame">
                            {/* Window header with EPS branding */}
                            <div className="board-window-header" style={{ backgroundColor: '#0F172A', borderBottom: '1px solid #1E293B' }}>
                                <div className="window-dots">
                                    <span className="dot red" />
                                    <span className="dot yellow" />
                                    <span className="dot green" />
                                </div>
                                <div className="window-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F8FAFC' }}>
                                    <img src={polyLogo} alt="EPS" style={{ height: '18px', width: 'auto' }} />
                                    <span>PolySpace · Projet Académique PFA / PFE 2026</span>
                                </div>
                                <div className="window-actions">
                                    <div className="avatar-stack">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=hamza" alt="Hamza" className="stack-avatar" title="Hamza Khaled (Manager)" />
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=sarah" alt="Sarah" className="stack-avatar" />
                                        <span className="stack-count">+120</span>
                                    </div>
                                    <span className="live-pill" style={{ backgroundColor: '#10B981', color: '#FFF' }}>CAMPUS ACTIF</span>
                                </div>
                            </div>

                            {/* Board columns snippet adapted to EPS academic work */}
                            <div className="board-mockup-body">
                                {/* Column 1: A FAIRE */}
                                <div className="mockup-column">
                                    <div className="column-header">
                                        <span className="column-title">RÉVISIONS & TÂCHES</span>
                                        <span className="jira-lozenge neutral">3</span>
                                    </div>
                                    <div className="mockup-card">
                                        <div className="card-top">
                                            <span className="ticket-key" style={{ color: '#38BDF8' }}>PREPA-101</span>
                                            <span className="priority-tag high"><HiBolt /> DS Approche</span>
                                        </div>
                                        <p className="card-title">Annales Algèbre Linéaire & Espaces Vectoriels (Corrigé 2024)</p>
                                        <div className="card-bottom">
                                            <span className="tag-chip" style={{ backgroundColor: '#0284C722', color: '#38BDF8' }}>PolyDrive</span>
                                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=youssef" alt="Youssef" className="card-avatar" />
                                        </div>
                                    </div>
                                    <div className="mockup-card">
                                        <div className="card-top">
                                            <span className="ticket-key" style={{ color: '#38BDF8' }}>STAGE-204</span>
                                            <span className="priority-tag medium">Novation City</span>
                                        </div>
                                        <p className="card-title">Candidature Stage PFA : Développeur FullStack MERN</p>
                                        <div className="card-bottom">
                                            <span className="tag-chip" style={{ backgroundColor: '#F5822022', color: '#F58220' }}>PolyStages</span>
                                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=nour" alt="Nour" className="card-avatar" />
                                        </div>
                                    </div>
                                </div>

                                {/* Column 2: EN COURS */}
                                <div className="mockup-column active-column">
                                    <div className="column-header">
                                        <span className="column-title">PROJETS EN COURS</span>
                                        <span className="jira-lozenge blue" style={{ backgroundColor: '#0066B3' }}>2</span>
                                    </div>
                                    <div className="mockup-card highlight-card" style={{ borderColor: '#F58220' }}>
                                        <div className="card-top">
                                            <span className="ticket-key" style={{ color: '#F58220' }}>GL-302</span>
                                            <span className="priority-tag urgent" style={{ backgroundColor: '#F5822033', color: '#F58220' }}>PFA Soutenance</span>
                                        </div>
                                        <p className="card-title">Conception Architecture Microservices & Déploiement Docker</p>
                                        <div className="card-bottom">
                                            <span className="tag-chip blue">Génie Logiciel</span>
                                            <div className="collaborator-badge">
                                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=hamza" alt="Hamza" className="card-avatar" />
                                                <span className="typing-indicator">Hamza (Manager)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Column 3: TERMINÉ */}
                                <div className="mockup-column">
                                    <div className="column-header">
                                        <span className="column-title">VALIDÉ & RENDU</span>
                                        <span className="jira-lozenge green">5</span>
                                    </div>
                                    <div className="mockup-card completed-card">
                                        <div className="card-top">
                                            <span className="ticket-key done-key">ROBOT-11</span>
                                            <span className="status-check"><HiCheck /></span>
                                        </div>
                                        <p className="card-title">Mini-Projet Robot Suiveur de Ligne (Club Robotique EPS)</p>
                                        <div className="card-bottom">
                                            <span className="tag-chip green">Club Robotique</span>
                                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=aziz" alt="Aziz" className="card-avatar" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* ── CAMPUS PHOTO BANNER ────────────────────── */}
            <div style={{
                position: 'relative',
                maxWidth: '1200px',
                margin: '-30px auto 40px',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #1E293B',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                zIndex: 3
            }}>
                <img
                    src={polyCampus}
                    alt="Campus École Polytechnique de Sousse"
                    style={{ width: '100%', height: '320px', objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(6, 11, 24, 0.2) 0%, rgba(6, 11, 24, 0.85) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '24px 32px'
                }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#F58220', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Notre Campus
                    </span>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#FFFFFF', margin: '4px 0 6px' }}>
                        École Polytechnique de Sousse · Sahloul
                    </h2>
                    <p style={{ margin: 0, color: '#CBD5E1', fontSize: '14px', maxWidth: '680px' }}>
                        Un environnement d'apprentissage moderne pour former les ingénieurs de demain. PolySpace connecte tous les étudiants au-delà des salles de cours.
                    </p>
                </div>
            </div>

            {/* ── SPECIALTIES TICKER ─────────────────────── */}
            <div className="trusted-logos-band">
                <div className="band-container">
                    <p className="trusted-label" style={{ color: '#F58220' }}>FILIÈRES & DÉPARTEMENTS COUVERTS À L'EPS</p>
                    <div className="logos-row">
                        {specialties.map((name, i) => (
                            <span key={i} className="company-logo" style={{ fontSize: '13px', color: '#94A3B8' }}>{name}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── STATS METRICS ROW ──────────────────────── */}
            <div className="stats-section">
                <div className="stats-grid">
                    {stats.map((stat, i) => (
                        <div key={i} className="stat-card" style={{ borderColor: '#1E293B' }}>
                            <span className="stat-icon" style={{ color: '#F58220' }}>{stat.icon}</span>
                            <strong className="stat-val" style={{ color: '#F8FAFC' }}>{stat.value}</strong>
                            <span className="stat-lbl" style={{ color: '#94A3B8' }}>{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── 4 KEY PILLARS TABS SECTION ─────────────── */}
            <div className="jira-features-section">
                <div className="section-header">
                    <span className="section-eyebrow" style={{ color: '#F58220' }}>LES 4 GRANDS SALONS POLYSPACE</span>
                    <h2>Tout ce dont un étudiant de Polytechnique a besoin pour réussir</h2>
                    <p className="section-subtitle">Une plateforme intégrée pour concilier excellence académique, projets d'équipe et préparation professionnelle.</p>
                </div>

                {/* Tabs switcher */}
                <div className="feature-tabs-nav">
                    {features.map((f) => (
                        <button
                            key={f.id}
                            className={`tab-btn ${activeTab === f.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(f.id)}
                            style={{
                                borderColor: activeTab === f.id ? '#0066B3' : 'transparent',
                                color: activeTab === f.id ? '#38BDF8' : '#94A3B8'
                            }}
                        >
                            <span className="tab-icon">{f.icon}</span>
                            <span className="tab-text">{f.tabTitle}</span>
                        </button>
                    ))}
                </div>

                {/* Active Tab Content */}
                <div className="feature-tab-display">
                    <div className="display-text">
                        <span className="feature-badge-pill" style={{ backgroundColor: '#0066B322', color: '#38BDF8', border: '1px solid #0066B355' }}>
                            {activeFeature.badge}
                        </span>
                        <h3>{activeFeature.title}</h3>
                        <p>{activeFeature.desc}</p>
                        <ul className="feature-bullet-list">
                            {activeFeature.bullets.map((b, idx) => (
                                <li key={idx}>
                                    <span className="bullet-check" style={{ backgroundColor: '#F5822022', color: '#F58220' }}><HiCheck /></span>
                                    {b}
                                </li>
                            ))}
                        </ul>
                        <Link to="/workspace" className="btn-feature-action" style={{ backgroundColor: '#0066B3' }}>
                            Rejoindre ce salon sur PolySpace <HiArrowRight />
                        </Link>
                    </div>

                    <div className="display-preview-card">
                        <div className="preview-header">
                            <span className="preview-dot red" />
                            <span className="preview-dot yellow" />
                            <span className="preview-dot green" />
                            <span className="preview-title">PolySpace EPS · {activeFeature.tabTitle}</span>
                        </div>
                        <div className="preview-body">
                            <div className="preview-grid-mock">
                                <div className="grid-item primary" style={{ backgroundColor: '#1E293B' }}>
                                    <strong style={{ color: '#F58220' }}>Communauté EPS Active</strong>
                                    <div className="progress-bar-wrap">
                                        <div className="progress-bar-fill" style={{ width: '88%', backgroundColor: '#0066B3' }} />
                                    </div>
                                    <small>Prépa 1 & 2 · Cycle Ingénieur (GL, Méca, Télécom)</small>
                                </div>
                                <div className="grid-item" style={{ backgroundColor: '#1E293B' }}>
                                    <strong>Manager de la plateforme</strong>
                                    <span className="metric-large" style={{ fontSize: '16px', color: '#38BDF8' }}>Hamza Khaled</span>
                                    <small className="trend positive" style={{ color: '#10B981' }}>Chef de Projet PolySpace</small>
                                </div>
                                <div className="grid-item" style={{ backgroundColor: '#1E293B' }}>
                                    <strong>Statut Accès</strong>
                                    <span className="metric-tag ai" style={{ backgroundColor: '#10B98122', color: '#10B981', border: '1px solid #10B98155' }}>
                                        <HiCheck style={{ marginRight: '4px' }} /> 100% Gratuit pour les étudiants
                                    </span>
                                    <small>Inscription ouverte avec compte Google / EPS</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── TESTIMONIALS SECTION ───────────────────── */}
            <div className="testimonials-section">
                <div className="section-header">
                    <span className="section-eyebrow" style={{ color: '#F58220' }}>RETOURS D'EXPÉRIENCE ÉTUDIANTS</span>
                    <h2>Ce que disent les étudiants de Polytechnique Sousse</h2>
                </div>

                <div className="testimonials-grid">
                    {testimonials.map((t, i) => (
                        <div key={i} className="testimonial-card" style={{ borderColor: '#1E293B' }}>
                            <p className="testimonial-quote">"{t.text}"</p>
                            <div className="author-row">
                                <img src={t.avatar} alt={t.author} className="author-avatar" />
                                <div>
                                    <strong style={{ color: '#F8FAFC' }}>{t.author}</strong>
                                    <span style={{ color: '#94A3B8' }}>{t.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── FINAL CTA BANNER (Polytechnique Sousse Gradient) ── */}
            <div className="final-cta-banner" style={{ background: 'linear-gradient(135deg, #0066B3 0%, #004077 50%, #F58220 100%)' }}>
                <div className="cta-banner-content">
                    <h2>Prêt à booster votre parcours à Polytechnique Sousse ?</h2>
                    <p>Rejoignez vos camarades de classe, partagez vos projets et préparez votre avenir d'ingénieur.</p>
                    <div className="cta-actions">
                        <Link to="/signup" className="btn-cta-white" style={{ color: '#0066B3', fontWeight: '800' }}>
                            Créer mon compte étudiant gratuit
                        </Link>
                        <Link to="/workspace" className="btn-cta-outline" style={{ borderColor: '#FFFFFF', color: '#FFFFFF' }}>
                            Accéder à l'Espace PolySpace
                        </Link>
                    </div>
                </div>
            </div>

            <HomePageFooter />
        </section>
    )
}
