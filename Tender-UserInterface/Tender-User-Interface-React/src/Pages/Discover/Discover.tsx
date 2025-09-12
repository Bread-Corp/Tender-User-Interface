import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Discover.css";
import TenderCard from "../../Components/TenderCard/tendercard.js";
import { FaSearch, FaFilter } from "react-icons/fa";
import ErrorBoundary from "../../Components/ErrorBoundary.js";
import FilterOverlay from "../../Components/FilterOverlay/FilterOverlay.js";
import { EskomTender } from "../../Models/EskomTender.js";
import { ETender } from "../../Models/eTender.js";
import { BaseTender } from "../../Models/BaseTender.js";
import { Tags } from "../../Models/Tags.js";

const apiURL = import.meta.env.VITE_API_URL;

const max_visible_filters = 4;

const Discover: React.FC = () => {
    const [showFilterOverlay, setShowFilterOverlay] = useState(false);
    const [filters, setFilters] = useState < string[] > (["New", "Programming", "Construction", "Emergency", "Green Energy"]);
    const [showAllFilters, setShowAllFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("Popularity");
    const [tenders, setTenders] = useState<(EskomTender | ETender)[]>([]);

    // Apply dark mode from localStorage
    useEffect(() => {
        const storedMode = localStorage.getItem("darkMode");
        document.body.classList.toggle("dark-mode", storedMode === "true");
    }, []);

    // the empty dependency array makes sure it only runs once when the component mounts
    useEffect(() => {
        // define async function to fetch tenders from the API
        const fetchTenders = async () => {
            try {
                // Make a GET request to the API endpoint to fetch tenders
                const response = await axios.get(`${apiURL}/tender/fetch`);

                // make sure the response data is akways an array
                // if  API returns a single object, wrap it in an array
                const data = Array.isArray(response.data) ? response.data : [response.data];

                // map over each tender item to convert it into an instance of a class
                const tenderObjects: BaseTender[] = data.map((item: any) => {
                    // convert the tags array into an array of Tag instances
                    // if the item has tags, map them - otherwise use emtpy array
                    const tagsArray: Tags[] = item.tags
                        ? item.tags.map((t: any) => new Tags(t.id || "", t.name || ""))
                        : [];

                    // decide which class to instantiate based on the source of the tender
                    // eg eskom tenders use the eskomtender class
                    if (item.source === "Eskom") {
                        return new EskomTender({
                            ...item,       
                            tag: tagsArray, 
                            source: item.source 
                        });
                    } else {
                        return new ETender({
                            ...item,
                            tag: tagsArray,
                            source: item.source || "ETender" // attempted fallback since the API does provide it - doesnt work :<
                        });
                    }
                });

                // log for debugging
                console.log("Fetched tenders:", tenderObjects);

                // update the state to store the fetched and processed tenders
                setTenders(tenderObjects);

            } catch (err) {
                // If the API request fails, log the error and reset the tenders state to empty
                console.error("Failed to fetch tenders:", err);
                setTenders([]);
            }
        };

        // call the async function to initiate the API request
        fetchTenders();
    }, []); // empty dependency array so this runs only once on component mount

    const removeFilter = (index: number) => {
        setFilters(prev => prev.filter((_, i) => i !== index));
    };

    const filteredTenders = tenders.filter(tender => {
        const titleMatch = (tender.title || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filters.length === 0 || tender.tag.some(tag => filters.includes(tag.name));
        return titleMatch && matchesFilter;
    });

    const visibleFilters = filters.slice(0, max_visible_filters);
    const hiddenCount = filters.length - visibleFilters.length;
    const filtersToShow = showAllFilters ? filters : visibleFilters;

    return (
        <div className="discovery-container">
            <h1 className="discovery-title">Discover</h1>
            <p className="discovery-subtitle">Search for public sector tenders in South Africa</p>

            {/* Filters */}
            <div className="filter-tags">
                {filtersToShow.map((filter, index) => (
                    <button key={index} className="filter-tag" onClick={() => removeFilter(index)}>
                        &times; {filter}
                    </button>
                ))}
                {!showAllFilters && hiddenCount > 0 && (
                    <button className="filter-tag hidden-count" onClick={() => setShowAllFilters(true)}>
                        +{hiddenCount}
                    </button>
                )}
            </div>

            {/* Search & filter overlay */}
            <div className="search-filter-container">
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

                <button className="filter-button" onClick={() => setShowFilterOverlay(true)}>
                    <FaFilter />
                </button>

                {showFilterOverlay && (
                    <FilterOverlay onClose={() => setShowFilterOverlay(false)} />
                )}
            </div>

            {/* Sorting */}
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

            {/* Tender Cards */}
            <ErrorBoundary>
                <div className="tender-list">
                    {filteredTenders.length > 0 ? (
                        filteredTenders.map((tender) => (
                            <TenderCard key={tender.tenderID} tender={tender} />
                        ))
                    ) : (
                        <p>Loading tenders...</p>
                    )}
                </div>
            </ErrorBoundary>
        </div>
    );
};

export default Discover;
