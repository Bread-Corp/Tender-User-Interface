import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import { FaBars, FaTimes, FaUserCircle, FaBell } from 'react-icons/fa';
import { useLocation, NavLink } from 'react-router-dom';

    const Navbar = () => {
        const [menuOpen, setMenuOpen] = useState(false);
        const [showNotifications, setShowNotifications] = useState(false);
        const notificationRef = useRef(null);
        const location = useLocation();
        const [showNavbar, setShowNavbar] = useState(true);
        const [showProfileDropdown, setShowProfileDropdown] = useState(false);
        const profileRef = useRef(null);

        // Close profile dropdown when clicking outside
        useEffect(() => {
            const handleClickOutside = (event) => {
                if (profileRef.current && !profileRef.current.contains(event.target)) {
                    setShowProfileDropdown(false);
                }
            };

            if (showProfileDropdown) {
                document.addEventListener('mousedown', handleClickOutside);
            }

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [showProfileDropdown]);

        // Hide navbar for login
        useEffect(() => {
            const hideNavbarPaths = ['/login'];
            const shouldHide = hideNavbarPaths.some(path => location.pathname.startsWith(path));
            setShowNavbar(!shouldHide);
        }, [location.pathname]);

        // Close notification panel when clicking outside
        useEffect(() => {
            const handleClickOutside = (event) => {
                if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                    setShowNotifications(false);
                }
            };

            if (showNotifications) {
                document.addEventListener('mousedown', handleClickOutside);
            }

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [showNotifications]);

        if (!showNavbar) return null;

    return (
        <>
            <div className="navbar">
                <div className="navbar-left">
                    <div className="logo">Tender Tool</div>
                </div>

                <div className={`navbar-center ${menuOpen ? 'open' : ''}`}>
                    <li>
                        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
                            About
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/discover" className={({ isActive }) => isActive ? 'active' : ''}>
                            Discover
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/analytics" className={({ isActive }) => isActive ? 'active' : ''}>
                            Analytics
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/tracking" className={({ isActive }) => isActive ? 'active' : ''}>
                            Tracking
                        </NavLink>
                    </li>
                </div>

                <div className="navbar-right">
                    <div
                        className="notification"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <FaBell />
                        <div className="dot" />
                    </div>
                    <FaUserCircle
                        className="profile-icon"
                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    />
                    {showProfileDropdown && (
                        <div className="profile-dropdown" ref={profileRef}>
                            <NavLink to="/login">Login</NavLink>
                            <NavLink to="/register">Register</NavLink>
                            <NavLink to="/profile">View Profile</NavLink>
                        </div>
                    )}

                    <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </div>
                </div>
            </div>

            {/* slide in notification panel */}
            <div
                className={`notification-panel ${showNotifications ? 'open' : ''}`}
                ref={notificationRef}
            >
                <div className="notification-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaBell />
                        <span>Notifications</span>
                    </div>
                    <FaTimes
                        className="close-btn"
                        onClick={() => setShowNotifications(false)}
                    />
                </div>
                <div className="notification-content">
                    <p>No new notifications</p>
                </div>
            </div>
        </>
    );
};

export default Navbar;
