import React from 'react';
import './TenderToolGraphic.css';

// --- Define your bar data here ---
// This makes it super easy to add, remove, or change bars
const barColors = [
    'red', 'blue', 'yellow', 'blue',
    'red', 'yellow', 'blue', 'red',
    'yellow', 'blue', 'red', 'yellow'
];

// Your repeating width pattern
const barWidths = ['60%', '85%', '70%', '78%'];

const TenderToolGraphic = () => {
    return (
        <>
            <div className="tender-container">
                {/* Loop over the bar data to render each bar */}
                {barColors.map((color, index) => {
                    // Calculate the dynamic properties
                    const delay = `${index * 0.05}s`;
                    const width = barWidths[index % barWidths.length];

                    return (
                        <div
                            key={index}
                            className={`bar ${color}`}
                            style={{
                                '--animation-delay': delay,
                                '--bar-width': width
                            }}
                        />
                    );
                })}
            </div>

            <div className="tender-text">
                <h1>Tender<br />Tool.</h1>
            </div>
        </>
    );
};

export default TenderToolGraphic;