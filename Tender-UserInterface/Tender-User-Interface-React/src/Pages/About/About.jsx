import React from 'react';
import './About.css';
import { useNavigate } from 'react-router-dom';

const About = () => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate('/login'); // routing
    };

    return (
        <div className="layout-wrapper">
            <div className="about-page">
                <section className="about-hero">
                    <h1>About Us</h1>
                    <p>
                        We're building intelligent tools to simplify tender discovery and analysis.
                        Our goal is to empower organisations with smarter, faster decisions.
                    </p>
                </section>

                <section className="about-mission">
                    <div className="text">
                        <h2>Our Mission</h2>
                        <p>
                            We aim to make government procurement accessible and transparent for all businesses by
                            centralising scattered information and delivering real-time, AI-enhanced insights.
                        </p>
                    </div>
                    <div className="image">
                        <img src="/images/mission.png" alt="Our mission illustration" />
                    </div>
                </section>

                <section className="about-values">
                    <div className="value-box">
                        <h3>Speed</h3>
                        <p>Instant access to tenders across all government portals.</p>
                    </div>
                    <div className="value-box">
                        <h3>Clarity</h3>
                        <p>AI-powered categorisation to find what's relevant.</p>
                    </div>
                    <div className="value-box">
                        <h3>Impact</h3>
                        <p>Helping teams focus on tenders they can win.</p>
                    </div>
                </section>

                <section className="about-cta">
                    <h2>Ready to explore tenders smarter?</h2>
                    <button onClick={handleRedirect}>Get Started</button>
                </section>
            </div>
        </div>
    );
};

export default About;
