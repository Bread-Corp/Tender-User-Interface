import React, { useEffect, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FaChevronDown } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const ProfilePanel = ({ show, toggle, close }) => {
    const profileRef = useRef(null);

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
        <div className="profile-nav-container" ref={profileRef}>
            <div className="profile-button" onClick={toggle}>
                <FaUserCircle className="profile-icon" />
                <FaChevronDown className="chevron-icon" />
            </div>
            <div className={`profile-dropdown ${show ? 'show' : ''}`}>
                <NavLink to="/login">Login</NavLink>
                <NavLink to={{ pathname:'/login', search: '?tab=register'} }>Register</NavLink>
                <NavLink to="/settings">Settings</NavLink>
                <NavLink to="/profile">Profile</NavLink>
            </div>
        </div>
    );
};

export default ProfilePanel;
