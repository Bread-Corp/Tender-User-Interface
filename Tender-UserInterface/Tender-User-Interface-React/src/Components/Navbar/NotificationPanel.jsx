import React, { useEffect, useState, useRef } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';
import NotificationCard from './NotificationCard'; 
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import axios from 'axios';
import { fetchUserAttributes } from '@aws-amplify/auth';
import { fetchAllNotifications } from '../../context/CoreLogicContext.js';

const NotificationPanel = ({ show, toggle, close, onReadNotif, isNotification }) => {
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

                //get CoreID
                let coreID = null;

                try {
                    const attributes = await fetchUserAttributes();

                    coreID = attributes['custom:CoreID'];

                } catch (error) {


                    if (error.name === 'NotAuthorizedException') {
                        navigate('/login');
                    }
                    setIsLoading(false);
                    return;
                }

                //fetch from corelogiccontext
                const notifs = await fetchAllNotifications(coreID)

                await new Promise(resolve => setTimeout(resolve, 500));
                setNotifications(notifs);

                setIsLoading(false);
            };

            fetchNotifications();
        }
    }, [show]);

    return (
        <>
            <div className="notification" onClick={() => { toggle(); onReadNotif(); }}>
                <FaBell />
                {/* conditional dot */}
                {isNotification && <div className="dot" />}
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