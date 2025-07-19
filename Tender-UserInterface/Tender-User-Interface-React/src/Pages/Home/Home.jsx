import React from 'react';
import { FaSearch, FaBell, FaChartBar, FaGavel } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Home.css'; // Optional: for custom styling

const Home = () => {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <h1 className="hero-title">Welcome to Tender Tool</h1>
            </section>

            {/* Feature Cards */}
            <section className="features">
                <FeatureCard
                    icon={<FaSearch />}
                    title="Discover"
                    desc="Suggestions tailored for you."
                    link="/discover"
                    buttonText="Explore"
                />
                <FeatureCard
                    icon={<FaBell />}
                    title="Notifications"
                    desc="You have 3 new alerts."
                    link="/profile"
                    buttonText="View Alerts"
                />
                <FeatureCard
                    icon={<FaChartBar />}
                    title="Analytics"
                    desc="Your activity summary in a glance."
                    link="/profile"
                    buttonText="View Analytics"
                />
                <FeatureCard
                    icon={<FaGavel />}
                    title="Tracking"
                    desc="Keep track of tenders you're interested in."
                    link="/tracking"
                    buttonText="View Tenders"
                />
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, link, buttonText }) => (
    <div className="home-card">
        <div className="icon">{icon}</div>
        <h3>{title}</h3>
        <p>{desc}</p>
        <Link to={link}>
            <button className="card-btn">{buttonText}</button>
        </Link>
    </div>
);

export default Home;
