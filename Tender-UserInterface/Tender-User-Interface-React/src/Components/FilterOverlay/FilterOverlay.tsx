import React, { useState, useEffect } from "react";
import "./FilterOverlay.css";
import { FaTimes } from 'react-icons/fa';

interface FilterOverlayProps {
    onClose: () => void;
    onApply: (filters: {
        date: string | null;
        tags: string[];
        alphabetical: string | null;
        status: string | null;
        sources: string[];
    }) => void;
    showToast: (message: string) => void
    availableTags: string[];
}

const sourceOptions = ['Eskom', 'eTenders', 'Transnet', 'SANRAL', 'SARS'];

const industryTags = [
    'Construction & Civil Engineering', 'IT & Software',
    'Consulting & Professional Serivces', 'Maintenance & Repairs',
    'Supply & Delivery', 'Financial & Auditing Services',
    'Logistics & Transport', 'Health, Safety & Environmental',
    'General Services', 'Training & Development'
];

const FilterOverlay: React.FC<FilterOverlayProps> = ({ onClose, onApply, showToast, availableTags }) => {
    const [closing, setClosing] = useState(false); // tracks closing animation

    // local state for each filter section
    const [date, setDate] = useState<string | null>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [alphabetical, setAlphabetical] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);
    const [selectedSources, setSelectedSources] = useState<string[]>([]);

    const handleApply = () => {
        onApply({ date, tags, alphabetical, status, sources: selectedSources }); // send filters to parent
        handleClose(); // then close overlay
    };

    // handles closing the overlay with animation
    const handleClose = () => setClosing(true);

    // clears all selected filters without closing the overlay
    const handleClear = () => {
        setDate(null);
        setTags([]);
        setAlphabetical(null);
        setStatus(null);
        setSelectedSources([]);
        showToast("Filters cleared!");
    };

    const handleSourceChange = (source: string, isChecked: boolean) => {
        setSelectedSources(prev => {
            if (isChecked) {
                return [...prev, source]; // Add source
            } else {
                return prev.filter(s => s !== source); // Remove source
            }
        });
    };

    useEffect(() => {
        setTags(availableTags); // set the initial checked state based on passed-in tags
    }, [availableTags]);

    // effect to actually call onClose() after the closing animation
    useEffect(() => {
        if (closing) {
            const timer = setTimeout(() => {
                onClose();
            }, 350); // matches CSS animation duration
            return () => clearTimeout(timer);
        }
    }, [closing, onClose]);

    return (
        <div
            className={`filter-overlay-backdrop ${closing ? "fade-out" : ""}`}
            onClick={handleClose} // clicking outside closes the overlay
        >
            <div
                className={`filter-overlay-panel ${closing ? "slide-out" : ""}`}
                onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            >
                {/* headers bar */}
                <div className="filter-header-bar">
                    <h2>Apply Filters</h2>
                    <button
                        className="filter-close-btn"
                        onClick={handleClose}
                        aria-label="Close filters"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* date filters */}
                <div className="filter-section">
                    <h3>Date</h3>
                    <label>
                        <input
                            type="radio"
                            name="date"
                            checked={date === "Closing Soon"}
                            onChange={() => setDate(date === "Closing Soon" ? null : "Closing Soon")}
                        />
                        Closing Soon
                    </label>
                </div>

                <div className="filter-section">
                    <h3>Industry Tags</h3> 
                    <div className="tag-list">
                        {industryTags.map((tag) => (
                            <label key={tag}>
                                <input
                                    type="checkbox"
                                    // checked still uses the 'tags' state
                                    checked={tags.includes(tag)}
                                    onChange={(e) => {
                                        // Update the 'tags' state
                                        const isChecked = e.target.checked;
                                        setTags(prev => {
                                            if (isChecked) {
                                                return [...prev, tag];
                                            } else {
                                                return prev.filter(t => t !== tag);
                                            }
                                        });
                                    }}
                                />
                                {tag}
                            </label>
                        ))}
                    </div>
                </div>

                {/* alphanetical filters */}
                <div className="filter-section">
                    <h3>Alphabetical</h3>
                    <label>
                        <input
                            type="radio"
                            name="alphabetical"
                            checked={alphabetical === "A-Z"}
                            onChange={() => setAlphabetical(alphabetical === "A-Z" ? null : "A-Z")}
                        />
                        A - Z
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="alphabetical"
                            checked={alphabetical === "Z-A"}
                            onChange={() => setAlphabetical(alphabetical === "Z-A" ? null : "Z-A")}
                        />
                        Z - A
                    </label>
                </div>

                {/* sttatus filters */}
                <div className="filter-section">
                    <h3>Status</h3>
                    <label>
                        <input
                            type="radio"
                            name="status"
                            checked={status === "Open"}
                            onChange={() => setStatus(status === "Open" ? null : "Open")}
                        />
                        Open
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="status"
                            checked={status === "Closed"}
                            onChange={() => setStatus(status === "Closed" ? null : "Closed")}
                        />
                        Closed
                    </label>
                </div>

                <div className="filter-section">
                    <h3>Sources</h3>
                    {sourceOptions.map((source) => (
                        <label key={source}>
                            <input
                                type="checkbox"
                                checked={selectedSources.includes(source)}
                                onChange={(e) => handleSourceChange(source, e.target.checked)}
                            />
                            {source}
                        </label>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="filter-actions">
                    {/* clear button resets selections but keeps overlay open */}
                    <button className="filter-clear-btn" onClick={handleClear}>
                        Clear
                    </button>
                    {/* apply button closes the overlay */}
                    <button className="filter-apply-btn" onClick={handleApply}>
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterOverlay;
