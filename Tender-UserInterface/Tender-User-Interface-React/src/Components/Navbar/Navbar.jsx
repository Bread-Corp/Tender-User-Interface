import React, { useState, useEffect, useRef } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import Notification from './NotificationPanel';
import ProfileMenu from './ProfilePanel';
import MenuIcon from './MobileMenu';
import './Navbar.css';

const Navbar = ({ isSignedIn, onLogoutSuccess, isAdmin, isNotification, onReadNotif }) => {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showNavbar, setShowNavbar] = useState(true);

    // hide navbar on login
    useEffect(() => {
        const hideNavbarPaths = ['/login'];
        const shouldHide = hideNavbarPaths.some(path => location.pathname.startsWith(path));
        setShowNavbar(!shouldHide);
    }, [location.pathname]);

    //hlper for read notif
    const helpReadNotif = () => {
        onReadNotif();
    }

    //hlper for is notif
    const helpIsNotif = () => {
        return isNotification;
    }

    if (!showNavbar) return null;

    return (
        <>
            <div className="navbar">
                <div className="navbar-left">
                    <div className="logo">Tender Tool</div>
                </div>

                <ul className={`navbar-center ${menuOpen ? 'open' : ''}`}>
                    <li>
                        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Home
                        </NavLink>
                    </li>

                    {!isAdmin && (
                        <li>
                            <NavLink to="/discover" className={({ isActive }) => (isActive ? 'active' : '')}>
                                Discover
                            </NavLink>
                        </li>
                    )}

                    <li>
                        <NavLink to="/analytics" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Analytics
                        </NavLink>
                    </li>

                    {isSignedIn && !isAdmin && (
                    <li>
                        <NavLink to="/tracking" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Watchlist
                        </NavLink>
                    </li>
                    )}

                    {isAdmin && (
                        <li>
                            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
                                Dashboard
                            </NavLink>
                        </li>
                    )}
                </ul>

                <div className="navbar-right">
                    {isSignedIn && (
                        <Notification
                            show={showNotifications}
                            toggle={() => setShowNotifications(prev => !prev)}
                            close={() => setShowNotifications(false)}
                            onReadNotif={helpReadNotif}
                            isNotification={isNotification}
                        />
                    )}
                        <ProfileMenu
                            show={showProfileDropdown}
                            toggle={() => setShowProfileDropdown(prev => !prev)}
                            close={() => setShowProfileDropdown(false)}
                            isSignedIn={isSignedIn}
                            onLogoutSuccess={onLogoutSuccess}
                        />

                    <MenuIcon open={menuOpen} toggle={() => setMenuOpen(prev => !prev)} />
                </div>
            </div>
        </>
    );
};

export default Navbar;
