import React, { useEffect, useRef } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';

const NotificationPanel = ({ show, toggle, close }) => {
    const notificationRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
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
        <>
            <div className="notification" onClick={toggle}>
                <FaBell />
                <div className="dot" />
            </div>

            <div className={`notification-panel ${show ? 'open' : ''}`} ref={notificationRef}>
                <div className="notification-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaBell />
                        <span>Notifications</span>
                    </div>
                    <FaTimes className="close-btn" onClick={close} />
                </div>
                <div className="notification-content">
                    <p>No new notifications</p>
                </div>
            </div>
        </>
    );
};

export default NotificationPanel;
