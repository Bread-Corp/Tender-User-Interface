import React, { useState, useEffect } from "react";
import "./FilterOverlay.css";

const FilterOverlay = ({ onClose }) => {

    const [closing, setClosing] = useState(false);
    const handleClose = () => {
        setClosing(true); // triggers the slide out animation
    };

    // after animation ends, call onClose to remove overlay
    useEffect(() => {
        if (closing) {
            const timer = setTimeout(() => {
                onClose();
            }, 300); // match css
            return () => clearTimeout(timer);
        }
    }, [closing, onClose]);

    return (
        <div
            className={`filter-overlay-backdrop ${closing ? "fade-out" : ""}`}
            onClick={handleClose}
        >
            <div
                className={`filter-overlay-panel ${closing ? "slide-out" : ""}`}
                onClick={(e) => e.stopPropagation()}
            >
           {/* headings and contents of the overlay*/}
                <h2>Filter Options</h2>
                <p>(These are placeholders, not functional)</p>
                <div className="filter-options">
                    <label><input type="checkbox" /> Option 1</label>
                    <label><input type="checkbox" /> Option 2</label>
                    <label><input type="checkbox" /> Option 3</label>
                </div>
                <button onClick={handleClose}>Close</button>
            </div>
        </div>
    );
};

export default FilterOverlay;
