import React, { useState } from 'react';
import './Discover.css';
import { FaMapMarkerAlt, FaRegClock, FaSearch, FaBookmark, FaBinoculars, FaFilter } from 'react-icons/fa';

// base tender
const baseTender = {
    title: "SUPPLY AND DELIVERY OF (162) BULK LAPTOPS FOR EXTENSION AND ADVISORY SERVICES",
    location: "Eastern Cape",
    closing: "Friday, 06 June 2025 - 11:00",
    tags: ["New", "Computer programming", "Consultancy"]
};

// mock data
const mockTenders = [
    { id: 1, ...baseTender },
    { id: 2, ...baseTender },
    { id: 3, ...baseTender }
];

const Discover = () => {
    const [filters, setFilters] = useState(["x", "x", "x", "x", "x"]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('Popularity');

    const removeFilter = (index) => {
        const updated = [...filters];
        updated.splice(index, 1);
        setFilters(updated);
    };

    return (
        <div className="discovery-container">
            <h1 className="discovery-title">Discover</h1>
            <p className="discovery-subtitle">Search for public sector tenders in South Africa</p>

            <div className="filter-tags">
                {filters.map((filter, index) => (
                    <button key={index} className="filter-tag" onClick={() => removeFilter(index)}>
                        × {filter}
                    </button>
                ))}
            </div>

            <div className="search-bar">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="filter-button">
                    <FaFilter />
                </button>
            </div>

            <div className="sort-container">
                <label className="sort-label">Sort by</label>
                <select
                    className="sort-select"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                >
                    <option>Popularity</option>
                    <option>Date</option>
                    <option>Region</option>
                </select>
            </div>

            <div className="tender-list">
                {mockTenders.map((tender) => (
                    <div className="tender-card" key={tender.id}>
                        <h2 className="tender-title">{tender.title}</h2>
                        <p className="tender-location"> <FaMapMarkerAlt />{tender.location}</p>
                        <p className="tender-closing"> <FaRegClock /> Closing Info: {tender.closing}</p>
                        <div className="tender-tags">
                            {tender.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className={`tag ${tag === "New" ? "tag-new" : "tag-blue"}`}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="tender-icons">
                            <FaBookmark className="icon" />
                            <FaBinoculars className="icon" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Discover;
