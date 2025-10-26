import React from 'react';
import './NotificationCard.css'; 
import { FaExclamationTriangle, FaCheckCircle, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NotificationCard = ({ notification, onCardClick }) => {
    const navigate = useNavigate();

    const { notificationID, title, message, created, type, fkTenderID } = notification;

    // diff icon based on type
    const getIcon = () => {
        switch (type) {
            case 'closingSoon':
                return <FaExclamationTriangle className="notification-card-icon alert" />;
            case 'watchlist':
                return <FaCheckCircle className="notification-card-icon success" />;
            default:
                return <FaBell className="notification-card-icon info" />;
        }
    };

    const handleClick = () => {
        if (fkTenderID) {
            navigate(`/tender/${fkTenderID}`);
        }
        // call prop to close the panel
        onCardClick();
    };

    return (
        <div className="notification-card" onClick={handleClick}>
            {getIcon()}
            <div className="notification-card-content">
                <h5 className="notification-card-title">{title}</h5>
                <p className="notification-card-message">{message}</p>
                <span className="notification-card-date">

                    {new Date(created).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </span>
            </div>
        </div>
    );
};

export default NotificationCard;