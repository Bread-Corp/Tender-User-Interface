import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Discover.css";
import TenderCard from "../../Components/TenderCard/tendercard";
import { FaSearch, FaFilter } from "react-icons/fa";
import ErrorBoundary from "../../Components/ErrorBoundary";

const Discover = () => {

    //triggered on initialisation.
    //Checks localstorage for previous stores and toggles the attribute on the body class then saves the setting to localStorage.
    useEffect(() => {
        const storedMode = localStorage.getItem("darkMode");
        document.body.classList.toggle("dark-mode", storedMode === "true");
    }, []);

    const [filters, setFilters] = useState(["New", "Programming", "Construction", "Emergency", "Green Energy"]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("Popularity");
    const [tenders, setTenders] = useState([]);

    //Tender Logic (maybe nest in seperate classes?)
    useEffect(() => {
        const fetchTenders = async () => {
            try {
                const response = await axios.get(
                    "https://ktomenjalj.execute-api.us-east-1.amazonaws.com/Prod/api/mocktender/getalltenders"
                );
                const tenderData = (response.data || []).map((item, index) => ({
                    index: index + 1,
                    // fallbacks if the information is missing
                    id: item.tenderID || `tender-${index}`,
                    title: item.title || "No Title",
                    location: item.location || "Unknown Location",
                    closing: item.closingDate || "Not Provided",
                    tags: Array.isArray(item.tags) ? item.tags.map(tag => tag.tagValue) : [], // changed to safely handle tags
                }));
                //cache the data here -- it would likely be best to hold the full list of tags and tender info in the cache
                //we can query and filter based on all the tenders in the cache! we set a timer to refresh db query every 5-10min

                ///set tender to list/array? of tenders stored in [data]

                setTenders(tenderData);
            } catch (err) {
                // log error and set tebders to empty to prevent crashes
                console.error("Failed to fetch tenders:", err);
                setTenders([]); // prevent crash if fetch fails
            }
        };
        //invoke
        fetchTenders();
    }, []);/*implement refresh variable to reinitialise this function*/

    const removeFilter = (index) => {
        setFilters(prev => prev.filter((_, i) => i !== index));
    };

    const filteredTenders = tenders.filter(tender => {
        const titleMatch = tender.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filters.length === 0 || tender.tags.some(tag => filters.includes(tag));
        return titleMatch && matchesFilter;
    });

    return (
        <div className="discovery-container">
            <h1 className="discovery-title">Discover</h1>
            <p className="discovery-subtitle">Search for public sector tenders in South Africa</p>

            {/* filters and search bar */}

            <div className="filter-tags">
                {filters.map((filter, index) => (
                    <button key={index} className="filter-tag" onClick={() => removeFilter(index)}>
                        &times; {filter}
                    </button>
                ))}
            </div>
            <div className= "search-filter-container">
            <div className="search-bar">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
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

            {/* error boundary will catch any rendering errors inside */}
            <ErrorBoundary>
                <div className="tender-list">
                    {filteredTenders.map((tender) => (
                        <TenderCard
                            key={tender.id}
                            title={tender.title}
                            location={tender.location}
                            closing={tender.closing}
                            tags={tender.tags}
                        />
                    ))}
                </div>
            </ErrorBoundary>
        </div>
    );
};

export default Discover;
