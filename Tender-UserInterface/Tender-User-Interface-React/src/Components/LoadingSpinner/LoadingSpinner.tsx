import React from 'react';
import "./LoadingSpinner.css";

interface LoadingSpinnerProps {
    text?: string; // text is optional
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = "Loading tenders..." }) => {
    return (
        <div className="spinner-container">
            <div className="spinner"></div>
            <p className="loading-text">{text}</p>
        </div>
    );
};

export default LoadingSpinner;