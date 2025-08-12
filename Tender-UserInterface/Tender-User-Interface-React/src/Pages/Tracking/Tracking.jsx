import React, { useState } from "react";
import "./Tracking.css";
import { FaMapMarkerAlt, FaRegClock, FaTrashAlt, FaChevronDown } from "react-icons/fa";

// mock data
const initialTenders = [
    {
        id: 1,
        title: "SUPPLY AND DELIVERY OF (162) BULK LAPTOPS",
        location: "Eastern Cape",
        closing: "Friday, 06 June 2025",
        status: "Open",
        note: "",
    },
    {
        id: 2,
        title: "VEHICLE MAINTENANCE SERVICES",
        location: "KwaZulu-Natal",
        closing: "Tuesday, 11 June 2025",
        status: "Closed",
        note: "",
    },
];

const Tracking = () => {

    const [tenders, setTenders] = useState(initialTenders);
    // state to track which status filter is active
    const [filter, setFilter] = useState("All");
    // state to track which tenders are currently expanded
    const [expanded, setExpanded] = useState([]);

    // updates the note field for a tender with matching id
    const updateNote = (id, value) => {
        setTenders((prev) =>
            prev.map((t) => (t.id === id ? { ...t, note: value } : t))
        );
    };

    // toggles expansion of a tender card by adding or removing its id
    const toggleExpand = (id) => {
        setExpanded((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    // filters tenders based on status dropdown
    const filteredTenders =
        filter === "All"
            ? tenders
            : tenders.filter((t) => t.status.toLowerCase() === filter.toLowerCase());

    return (
        <div className="saved-tenders-container">
            <h2 className="page-title">Tracked Tenders</h2>

            <div className="filter-container">
                <label htmlFor="statusFilter">Filter by Status:</label>
                <select
                    id="statusFilter"
                    onChange={(e) => setFilter(e.target.value)}
                    value={filter}
                >
                    <option value="All">All</option>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                </select>
            </div>

            <div className="tender-grid">
                {filteredTenders.map((tender) => (
                    // tender card click toggles expansion
                    <div
                        className="tender-card"
                        key={tender.id}
                    >
                        {/* card header displays title status + expand icon */}
                        <div className="card-header">
                            <h3>{tender.title}</h3>
                            <div className="card-header-right">
                                <span className={`status-badge ${tender.status.toLowerCase()}`}>
                                    {tender.status}
                                </span>
                                {/* rotate aroow when expanded */}
                                <FaChevronDown
                                    className={`expand-icon ${expanded.includes(tender.id) ? "rotated" : ""}`}
                                    onClick={(e) => {
                                        e.stopPropagation(); // prevent triggering any parent clicks
                                        toggleExpand(tender.id);
                                    }}
                                />
                            </div>
                        </div>

                        {expanded.includes(tender.id) && (
                            <>
                                <p className="location">
                                    <FaMapMarkerAlt /> {tender.location}
                                </p>
                                <p className="closing-date">
                                    <FaRegClock /> Closing: {tender.closing}
                                </p>
                                {/* prevents parent card click from collapsing when clicking inside buttons */}
                                <div
                                    className="card-actions"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button className="remove-btn">
                                        <FaTrashAlt /> Remove
                                    </button>
                                    <button className="view-btn">View Tender</button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tracking;
