import React, { useEffect, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const ProfilePanel = ({ show, toggle, close }) => {
    const profileRef = useRef(null);

    // close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                close();
            }
        };

        if (show) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [show, close]);

    return (
        <div className="profile-nav-container">
            <FaUserCircle className="profile-icon" onClick={toggle} />
            <div
                className={`profile-dropdown ${show ? 'show' : ''}`}
                ref={profileRef}
            >
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
                <NavLink to="/profile">Settings</NavLink>
            </div>
        </div>
    );
};

export default ProfilePanel;
