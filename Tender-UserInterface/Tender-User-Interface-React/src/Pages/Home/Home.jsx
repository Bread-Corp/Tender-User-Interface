import React, { useState } from 'react';
import { FaCalendarCheck, FaSearch, FaRegBookmark, FaUser, FaEnvelope, FaCommentDots } from 'react-icons/fa';
import './Home.css';
import { Link } from "react-router-dom";
import axios from 'axios';

const Home = () => {
    const [email, setEmail] = useState(null);
    const [userName, setUserName] = useState(null);
    const [message, setMessage] = useState(null);

    //contact us - handler
    const sendMessage = async (e) => {
        e.preventDefault();
        console.log("Sending:", { email, userName, message });

        if (!email || !userName || !message) {
            alert("Please fill out all fields before submitting.");
            return;
        }

        try {
            const res = await axios.post(`${import.meta.env.VITE_MAILER_API}`, { userEmail: email, userName });

            if (res.status === 200) {
                alert("Your message has been sent!");
                setUserName(""); setEmail(""); setMessage("");
            } else {
                alert("Failed to send message. Please try again later.");
            }
        }
        catch (err) {
            console.error("Failed to contact mailer service", err);
        }
    }

    return (
        <div className="home-container">
            <section className="hero-home">
                <div className="hero-content-home">
                    <h1>Welcome to Tender Tool</h1>
                    <p>Discover and track the latest South African IT tenders- scraped, sorted and simplified.</p>
                    <div className="hero-buttons">
                      <Link to ="/discover" className="btn-primary">Search Tenders</Link>
                    </div>
                </div>
            </section>

            <section className="features">
                <h2>Why Tender Tool?</h2>
                <p className="subtext">Built to simplify your tendering experience.</p>
                <div className="feature-cards">
                    <div className="feature-card">
                        <FaCalendarCheck size={40} className="feature-icon" />
                        <h3>Up-to-date</h3>
                        <p>We scrape and deliver current IT tenders every day.</p>
                    </div>
                    <div className="feature-card">
                        <FaSearch size={40} className="feature-icon" />
                        <h3>Smart Search</h3>
                        <p>Filter tenders by category, province and closing date.</p>
                    </div>
                    <div className="feature-card">
                        <FaRegBookmark size={40} className="feature-icon" />
                        <h3>Save & Track</h3>
                        <p>Bookmark tenders and track your submissions.</p>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <h2>Ready to Get Started?</h2>
                <p>Create your free account and streamline your tender search today.</p>
                <Link to={{ pathname: '/login', search: '?tab=register' }} className = "btn-secondary-dark">Create Account</Link>
            </section>

            <section className="contact-section">
                <h2>Let's Connect</h2>
                <p>Questions or suggestions? We'd love to hear from you.</p>
                <form className="contact-form">
                    <div className="input-icon-group">
                        <FaUser className="input-icon" />
                        <input type="text" placeholder="Your Name" value={userName} onChange={(e) => setUserName(e.target.value)} required />
                    </div>
                    <div className="input-icon-group">
                        <FaEnvelope className="input-icon" />
                        <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="input-icon-group">
                        <FaCommentDots className="input-icon" />
                        <textarea placeholder="Your Message" rows="4" value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
                    </div>
                    <button className="btn-secondary-light" type="submit" onClick={ sendMessage }>Send Message</button>
                </form>
            </section>

            <footer className="footer">
                &copy; {new Date().getFullYear()} Tender Tool. All rights reserved.{''}
                <Link to="/policy" className="footer-link">
                    Privacy Policy
                </Link>
            </footer>
        </div>
    );
};

export default Home;
