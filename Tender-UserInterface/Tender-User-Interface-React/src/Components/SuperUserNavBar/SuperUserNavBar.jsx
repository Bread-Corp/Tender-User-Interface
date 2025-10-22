import React from 'react';
import './SuperUserNavBar.css';
import { FaBell, FaCog, FaUserCircle } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const SuperUserNavBar = () => {
    return (
        <nav className="superuser-navbar">
            <div className="navbar-left">
                <div className="app-logo">Tender Tool</div>
                <NavLink
                    to="/superuser/dashboard"
                    className={({ isActive }) => isActive ? 'active' : ''}
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/superuser/analytics"
                    className={({ isActive }) => isActive ? 'active' : ''}
                >
                    Analytics
                </NavLink>
            </div>

            <div className="navbar-right">
                <FaBell className="nav-icon" title="Notifications" />
                <FaCog className="nav-icon" title="Settings" />
                <FaUserCircle className="nav-icon" title="Profile" />
            </div>
        </nav>
    );
};

export default SuperUserNavBar;
