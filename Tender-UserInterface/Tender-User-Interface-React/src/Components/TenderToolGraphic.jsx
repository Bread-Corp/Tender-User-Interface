import React, { useState, useEffect } from 'react';
import './TenderToolGraphic.css';

const barColors = [
    'red', 'blue', 'yellow', 'blue',
    'red', 'yellow', 'blue', 'red',
    'yellow', 'blue', 'red', 'yellow'
];

const barWidths = ['60%', '85%', '70%', '78%'];
function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []); 

    return windowSize;
}

const TenderToolGraphic = () => {

    const { width, height } = useWindowSize();

    const BAR_HEIGHT = 70; // .bar height
    const BAR_GAP = 20;    // .tender-container gap
    const BAR_PLUS_GAP = BAR_HEIGHT + BAR_GAP;
    // buffer
    const diagonal = Math.sqrt(width ** 2 + height ** 2);
    const numBars = Math.ceil(diagonal / BAR_PLUS_GAP) + 3;

    return (
        <>
            <div className="tender-container">
                {/* loop over the bar data to render each bar */}
                {Array.from({ length: numBars }).map((_, index) => {

                    const color = barColors[index % barColors.length];
                    const width = barWidths[index % barWidths.length];
                    const delay = `${index * 0.05}s`;

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