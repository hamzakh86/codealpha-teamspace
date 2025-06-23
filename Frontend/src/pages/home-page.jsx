import React from 'react'

import { Link } from 'react-router-dom'
import { HomePageFooter } from '../cmps/home-page/home-page-footer'

export function HomePage() {

    return (
        <>
            <section className="home-page">

                <div className="bg-gradient-hero">

                    <section className="hero-secrion">

                        <div className="text">
                            <h1>TeamSpace revolutionizes team collaboration and project management</h1>

                            <p>Streamline your workflow, enhance team communication, and achieve your goals faster than ever before.</p>

                            <Link to="/workspace">
                                <button className="start-demo-btn">Get Started Today</button>
                            </Link>
                        </div>

                        <div className="img">
                            <img className="hero-img" src={require('../assets/img/teamspace-hero.jpg')} alt="teamspace-hero" />
                        </div>

                    </section>


                    <svg className="shape-divider" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill" fill="white"></path>
                    </svg>
                </div>

                <div className="bg-gradient-101">

                    <section className="teamspace-features">

                        <div className="prod-div">

                            <h5>TeamSpace Essentials</h5>

                            <h2>The ultimate collaboration platform</h2>

                            <p>Intuitive, scalable, and designed for modern teams. Our comprehensive suite of tools empowers your team to collaborate seamlessly, track progress effortlessly, and deliver exceptional results consistently.</p>
                        </div>

                        <div className="prod-cards-div">

                            <button className="cards-btn card-workspaces" >
                                <h5>Workspaces</h5>
                                <p>Centralized hubs where teams organize projects, share resources, and maintain clear visibility across all initiatives. Transform scattered work into structured success.</p>
                                <div></div>
                            </button>


                            <button className="cards-btn card-collaboration">
                                <h5>Real-time Collaboration</h5>
                                <p>Seamless communication tools that keep everyone connected. From instant messaging to video calls, ensure your team stays aligned and productive regardless of location.</p>
                                <div></div>
                            </button>


                            <button className="cards-btn card-analytics">
                                <h5>Smart Analytics</h5>
                                <p>Powerful insights and reporting tools that help you understand team performance, identify bottlenecks, and make data-driven decisions to optimize your workflow.</p>
                                <div></div>
                            </button>

                        </div>
                    </section>
                </div>

        <HomePageFooter />
    </section >
        </>
    )

}

