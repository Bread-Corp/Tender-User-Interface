import React, { useState, useEffect } from "react";
import "./FilterOverlay.css";
import { FaTimes } from 'react-icons/fa';

interface FilterOverlayProps {
    onClose: () => void;
}

const FilterOverlay: React.FC<FilterOverlayProps> = ({ onClose }) => {
    const [closing, setClosing] = useState(false);

    const handleClose = () => {
        setClosing(true);
    };

    useEffect(() => {
        if (closing) {
            const timer = setTimeout(() => {
                onClose();
            }, 350); // match CSS animation duration
            return () => clearTimeout(timer);
        }
    }, [closing, onClose]);

    return (
        <div
            className={`filter-overlay-backdrop ${closing ? "fade-out" : ""}`}
            onClick={handleClose}>

            <div
                className={`filter-overlay-panel ${closing ? "slide-out" : ""}`}
                onClick={(e) => e.stopPropagation()}>

                {/* Header Bar */}
                <div className="filter-header-bar">
                    <h2>Apply Filters</h2>
                    <button
                        className="filter-close-btn"
                        onClick={handleClose}
                        aria-label="Close filters">
                        <FaTimes />
                    </button>
                </div>

                {/* Filter Sections */}
                <div className="filter-section">
                    <h3>Date</h3>
                    <label><input type="radio" name="date" /> Closing Soon</label>
                    <label><input type="radio" name="date" /> Newly Added</label>
                </div>

                <div className="filter-section">
                    <h3>Tags</h3>
                    <label><input type="checkbox" name="tags" /> IT & Software</label>
                    <label><input type="checkbox" name="tags" /> Construction</label>
                    <label><input type="checkbox" name="tags" /> Healthcare</label>
                    <label><input type="checkbox" name="tags" /> Finance</label>
                </div>

                <div className="filter-section">
                    <h3>Alphabetical</h3>
                    <label><input type="radio" name="alphabetical" /> A - Z</label>
                    <label><input type="radio" name="alphabetical" /> Z - A</label>
                </div>

                <div className="filter-section">
                    <h3>Status</h3>
                    <label><input type="radio" name="status" /> Open</label>
                    <label><input type="radio" name="status" /> Closed</label>
                </div>

                {/* Action Buttons */}
                <div className="filter-actions">
                    <button className="filter-clear-btn" onClick={handleClose}>Clear</button>
                    <button className="filter-apply-btn" onClick={handleClose}>Apply</button>
                </div>
            </div>
        </div>
    );
};

export default FilterOverlay;
