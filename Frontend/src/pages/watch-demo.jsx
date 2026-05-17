import React from 'react'
import { Link } from 'react-router-dom'

export function WatchDemo() {
    return (
        <section className="watch-demo-page">
            
            {/* Background effects */}
            <div className="demo-bg-effects">
                <div className="glow glow-1"></div>
                <div className="glow glow-2"></div>
                <div className="glow glow-3"></div>
            </div>

            <div className="demo-container">
                
                {/* Header */}
                <header className="demo-header">
                    <Link to="/" className="btn-back">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Back to Home
                    </Link>
                    
                    <div className="demo-title">
                        <span className="badge">Preview</span>
                        <h1>See TeamSpace in Action</h1>
                        <p>Discover how our premium tools can transform your team's workflow in under 3 minutes.</p>
                    </div>
                </header>

                {/* Video Player Mockup */}
                <div className="video-player-wrapper">
                    <div className="video-player-glass">
                        
                        {/* Fake Browser Top Bar */}
                        <div className="browser-bar">
                            <div className="window-controls">
                                <span></span><span></span><span></span>
                            </div>
                            <div className="url-bar">teamspace.app/demo-video</div>
                        </div>

                        {/* Video Content Area */}
                        <div className="video-content">
                            <div className="play-button-overlay">
                                <button className="btn-play-massive">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                    </svg>
                                </button>
                                <span>Click to play</span>
                            </div>
                            
                            {/* Abstract placeholder graphics */}
                            <div className="placeholder-ui">
                                <div className="sidebar"></div>
                                <div className="main">
                                    <div className="header"></div>
                                    <div className="board">
                                        <div className="column"><div className="card"></div><div className="card"></div></div>
                                        <div className="column"><div className="card"></div></div>
                                        <div className="column"><div className="card"></div><div className="card"></div><div className="card"></div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Video Controls Bar */}
                        <div className="video-controls">
                            <div className="progress-bar">
                                <div className="progress-fill"></div>
                                <div className="progress-handle"></div>
                            </div>
                            <div className="controls-row">
                                <div className="left-controls">
                                    <button><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></button>
                                    <button><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg></button>
                                    <span className="time">00:00 / 03:14</span>
                                </div>
                                <div className="right-controls">
                                    <button><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg></button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="demo-cta">
                    <h3>Ready to upgrade your workflow?</h3>
                    <Link to="/workspace">
                        <button className="btn-cta-primary">Start your free trial today</button>
                    </Link>
                </div>

            </div>
        </section>
    )
}
