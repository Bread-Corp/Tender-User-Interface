import React, { useEffect, useRef } from 'react';
import { FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from '@aws-amplify/auth';

const ProfilePanel = ({ show, toggle, close, isSignedIn, onLogoutSuccess }) => {
    const profileRef = useRef(null);
    const navigate = useNavigate();

    // logout handler
    const handleLogout = async () => {
        try {
            await signOut();
            onLogoutSuccess();
            navigate('/login');
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };

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
        <div className="profile-nav-container" ref={profileRef}>
            <div className="profile-button" onClick={toggle}>
                <FaUserCircle className="profile-icon" />
                <FaChevronDown className="chevron-icon" />
            </div>

            <div className={`profile-dropdown ${show ? 'show' : ''}`}>
                {isSignedIn ? (
                    // --- Show these when SIGNED IN ---
                    <>
                        <NavLink to="/settings" className="dropdown-link">Settings</NavLink>
                        <NavLink
                            to="/login"
                            className="dropdown-link logout-link"
                            onClick={(e) => {
                                e.preventDefault(); // stop default navigation
                                handleLogout();
                            }}
                        >
                            Logout
                        </NavLink>
                    </>
                ) : (
                    // --- Show these when SIGNED OUT ---
                    <>
                        <NavLink to="/login" className="dropdown-link">Login</NavLink>
                        <NavLink to={{ pathname: '/login', search: '?tab=register' }} className="dropdown-link">Register</NavLink>
                        <NavLink to="/settings" className="dropdown-link">Settings</NavLink>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfilePanel;
