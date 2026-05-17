import React from 'react'
import { Link } from 'react-router-dom'
import { HomePageFooter } from '../cmps/home-page/home-page-footer'

export function HomePage() {

    const stats = [
        { value: '50K+', label: 'Teams worldwide', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '100%', height: '100%'}}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg> },
        { value: '2M+', label: 'Tasks completed', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '100%', height: '100%'}}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
        { value: '99.9%', label: 'Uptime guarantee', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '100%', height: '100%'}}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
        { value: '4.9★', label: 'Average rating', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '100%', height: '100%'}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
    ]

    const trustedBy = [
        'Acme Corp', 'PixelWave', 'NovaTech', 'Stride', 'Orbit Labs', 'Fusion'
    ]

    const testimonials = [
        {
            text: "TeamSpace transformed how our remote team collaborates. We ship 3x faster now.",
            author: "Sarah M.",
            role: "CTO @ PixelWave",
            avatar: "SM"
        },
        {
            text: "The Kanban boards and real-time sync are absolutely flawless. Best tool we've ever used.",
            author: "James K.",
            role: "Product Lead @ NovaTech",
            avatar: "JK"
        },
        {
            text: "Onboarding took 10 minutes. Our whole team was productive from day one.",
            author: "Amira B.",
            role: "Engineering Manager @ Stride",
            avatar: "AB"
        }
    ]

    return (
        <>
            <section className="home-page">

                {/* ── HERO SECTION ─────────────────────────── */}
                <div className="bg-gradient-hero">
                    <section className="hero-secrion">
                        <div className="text">

                            <div className="hero-badge">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 14, height: 14, marginRight: 6, display: 'inline-block'}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                                Now with AI-powered task suggestions
                            </div>

                            <h1>TeamSpace revolutionizes team collaboration and project management</h1>

                            <p>Streamline your workflow, enhance team communication, and achieve your goals faster than ever before.</p>

                            <div className="hero-cta-group">
                                <Link to="/workspace" className="btn-cta-primary">
                                    Start for free
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 18, height: 18}}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                                </Link>
                                <Link to="/watch-demo" className="btn-cta-secondary">
                                    Watch Demo ▶
                                </Link>
                            </div>

                            <div className="hero-trust">
                                <div className="trust-item">
                                    <span className="trust-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{width: 12, height: 12}}><polyline points="20 6 9 17 4 12"/></svg></span>
                                    No credit card required
                                </div>
                                <div className="trust-item">
                                    <span className="trust-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{width: 12, height: 12}}><polyline points="20 6 9 17 4 12"/></svg></span>
                                    Free forever plan
                                </div>
                                <div className="trust-item">
                                    <span className="trust-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{width: 12, height: 12}}><polyline points="20 6 9 17 4 12"/></svg></span>
                                    Setup in 5 minutes
                                </div>
                            </div>
                        </div>

                        <div className="img">
                            <img className="hero-img" src={require('../assets/img/teamspace-hero.jpg')} alt="teamspace-hero" />
                        </div>
                    </section>

                    {/* Wave Divider */}
                    <svg className="shape-divider" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
                        <path d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z" className="shape-fill" fill="white"></path>
                    </svg>
                </div>

                {/* ── WHITE SOCIAL PROOF SECTION ─────────────── */}
                <div className="bg-white-section">

                    {/* Stats Row */}
                    <div className="stats-band">
                        {stats.map((stat, i) => (
                            <div className="stat-item" key={i}>
                                <span className="stat-icon">{stat.icon}</span>
                                <span className="stat-value">{stat.value}</span>
                                <span className="stat-label">{stat.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Trusted By */}
                    <div className="trusted-band">
                        <p className="trusted-label">Trusted by teams at</p>
                        <div className="trusted-logos">
                            {trustedBy.map((name, i) => (
                                <div className="trusted-logo-item" key={i}>
                                    <span className="logo-dot">●</span>
                                    {name}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Testimonials */}
                    <div className="testimonials-band">
                        {testimonials.map((t, i) => (
                            <div className="testimonial-card" key={i}>
                                <div className="testimonial-stars">★★★★★</div>
                                <p className="testimonial-text">"{t.text}"</p>
                                <div className="testimonial-author">
                                    <div className="testimonial-avatar">{t.avatar}</div>
                                    <div>
                                        <div className="author-name">{t.author}</div>
                                        <div className="author-role">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Wave bottom */}
                    <svg className="shape-divider-bottom" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
                        <path d="M0,60 C360,0 1080,120 1440,60 L1440,0 L0,0 Z" fill="white"></path>
                    </svg>
                </div>

                {/* ── FEATURES SECTION ─────────────────────── */}
                <div className="bg-gradient-101">
                    <section className="teamspace-features">
                        <div className="prod-div">
                            <h5>TeamSpace Essentials</h5>
                            <h2>The ultimate collaboration platform</h2>
                            <p>Intuitive, scalable, and designed for modern teams. Our comprehensive suite of tools empowers your team to collaborate seamlessly, track progress effortlessly, and deliver exceptional results consistently.</p>
                        </div>

                        <div className="prod-cards-div">
                            <button className="cards-btn card-workspaces">
                                <div className="card-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '100%', height: '100%'}}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                                </div>
                                <h5>Workspaces</h5>
                                <p>Centralized hubs where teams organize projects, share resources, and maintain clear visibility across all initiatives.</p>
                                <div className="card-accent"></div>
                            </button>

                            <button className="cards-btn card-collaboration">
                                <div className="card-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '100%', height: '100%'}}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                                </div>
                                <h5>Real-time Collaboration</h5>
                                <p>Seamless communication tools that keep everyone connected. Instant updates, live cursors, and smart notifications.</p>
                                <div className="card-accent"></div>
                            </button>

                            <button className="cards-btn card-analytics">
                                <div className="card-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '100%', height: '100%'}}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                                </div>
                                <h5>Smart Analytics</h5>
                                <p>Powerful insights and reporting tools that help you understand team performance and make data-driven decisions.</p>
                                <div className="card-accent"></div>
                            </button>
                        </div>
                    </section>
                </div>

                <HomePageFooter />
            </section>
        </>
    )
}
