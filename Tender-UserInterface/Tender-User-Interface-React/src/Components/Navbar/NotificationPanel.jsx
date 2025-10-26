import React, { useEffect, useState, useRef } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';
import NotificationCard from './NotificationCard'; 
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import axios from 'axios';
import { fetchUserAttributes } from '@aws-amplify/auth';

const mockNotifications = [
    {
        "notificationID": "fe58a3ba-3b38-4e16-a44a-bee263752771",
        "title": "Tender Closing Soon",
        "message": "Supplies: Medical is closing soon.",
        "type": "closingSoon",
        "created": "2025-10-26T12:28:47.3170719",
        "fkTenderID": "efb14e09-b85c-4909-aabb-00f2a55599fd",
    },
    {
        "notificationID": "f82ad857-9ead-4267-b507-8329e9a97a62",
        "title": "Toggled Watch",
        "message": "Supplies: Medical is on your watchlist.",
        "type": "watchlist",
        "created": "2025-10-26T12:28:42.7763514",
        "fkTenderID": "efb14e09-b85c-4909-aabb-00f2a55599fd",
    },
    {
        "notificationID": "f82ad857-9ead-4267-b507-8329e9a97a62",
        "title": "Toggled Watch",
        "message": "Supplies: Medical is on your watchlist.",
        "type": "watchlist",
        "created": "2025-10-26T12:28:42.7763514",
        "fkTenderID": "efb14e09-b85c-4909-aabb-00f2a55599fd",
    }
];

const NotificationPanel = ({ show, toggle, close }) => {
    const notificationRef = useRef(null);
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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

    useEffect(() => {
        if (show) {
            const fetchNotifications = async () => {
                setIsLoading(true);

                await new Promise(resolve => setTimeout(resolve, 500));
                setNotifications(mockNotifications);

                setIsLoading(false);
            };

            fetchNotifications();
        }
    }, [show]);

    return (
        <>
            <div className="notification" onClick={toggle}>
                <FaBell />
                {/* conditional dot */}
                {notifications.length > 0 && <div className="dot" />}
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
                    {isLoading ? (
                        <div style={{ padding: '20px' }}>
                            <LoadingSpinner text="Loading..." />
                        </div>
                    ) : notifications.length === 0 ? (
                        <p className="no-notifications-msg">No new notifications</p>
                    ) : (
                        notifications.map(notif => (
                            <NotificationCard
                                key = { notif.notificationID } 
                                notification = { notif }
                                onCardClick = { close }
                            />
                        ))
                    )}
                    
                </div>
            </div>
        </>
    );
};

export default NotificationPanel;