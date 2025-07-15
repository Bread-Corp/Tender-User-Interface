import React from 'react';
import './TenderToolGraphic.css';

const TenderToolGraphic = () => {
    return (
        <>
            <div className="tender-container">
                <div className="bar red" />
                <div className="bar blue" />
                <div className="bar yellow" />
                <div className="bar blue" />
                <div className="bar red" />
                <div className="bar yellow" />
                <div className="bar blue" />
            </div>

            <div className="tender-text">
                <h1>Tender<br />Tool.</h1>
            </div>
        </>
    );
};

export default TenderToolGraphic;
