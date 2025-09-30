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
    }) => void;
    showToast: (message: string) => void
}

const FilterOverlay: React.FC<FilterOverlayProps> = ({ onClose, onApply, showToast }) => {
    const [closing, setClosing] = useState(false); // tracks closing animation

    // local state for each filter section
    const [date, setDate] = useState<string | null>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [alphabetical, setAlphabetical] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);

    const handleApply = () => {
        onApply({ date, tags, alphabetical, status }); // send filters to parent
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
        showToast("Filters cleared!");
    };

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
                            onChange={() => setDate("Closing Soon")}
                        />
                        Closing Soon
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="date"
                            checked={date === "Newly Added"}
                            onChange={() => setDate("Newly Added")}
                        />
                        Newly Added
                    </label>
                </div>

                {/* tag filters - not sure hwo this is going to work yet */}
                <div className="filter-section">
                    <h3>Tags</h3>
                    {["IT & Software", "Construction", "Healthcare", "Finance"].map((tag) => (
                        <label key={tag}>
                            <input
                                type="checkbox"
                                checked={tags.includes(tag)} // reflects selected tags
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setTags([...tags, tag]); // add tag
                                    } else {
                                        setTags(tags.filter((t) => t !== tag)); // remove tag
                                    }
                                }}
                            />
                            {tag}
                        </label>
                    ))}
                </div>

                {/* alphanetical filters */}
                <div className="filter-section">
                    <h3>Alphabetical</h3>
                    <label>
                        <input
                            type="radio"
                            name="alphabetical"
                            checked={alphabetical === "A-Z"}
                            onChange={() => setAlphabetical("A-Z")}
                        />
                        A - Z
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="alphabetical"
                            checked={alphabetical === "Z-A"}
                            onChange={() => setAlphabetical("Z-A")}
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
                            onChange={() => setStatus("Open")}
                        />
                        Open
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="status"
                            checked={status === "Closed"}
                            onChange={() => setStatus("Closed")}
                        />
                        Closed
                    </label>
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
