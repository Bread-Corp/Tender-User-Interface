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
import Modal from "../../Components/Modal/Modal.jsx";

const apiURL = import.meta.env.VITE_API_URL;

const max_visible_filters = 4;
 
const Discover: React.FC = () => {
    const [showFilterOverlay, setShowFilterOverlay] = useState(false);
    const [filters, setFilters] = useState < string[] > (["New", "Programming", "Construction", "Emergency", "Green Energy"]);
    const [showAllFilters, setShowAllFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("Popularity");
    //fetchTenders states
    const [tenders, setTenders] = useState<(EskomTender | ETender)[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0)

    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("userToken"));
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    // overlay filter state
    const [overlayFilters, setOverlayFilters] = useState<{
        date: string | null;
        tags: string[];
        alphabetical: string | null;
        status: string | null;
    }>({
        date: null,
        tags: [],
        alphabetical: null,
        status: null,
    });

    // hlper for toast message
    const showToast = (message: string, duration = 2000) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), duration);
    };

    // Apply dark mode from localStorage
    useEffect(() => {
        const storedMode = localStorage.getItem("darkMode");
        document.body.classList.toggle("dark-mode", storedMode === "true");
    }, []);

    // the empty dependency array makes sure it only runs once when the component mounts
    useEffect(() => {
        const pageSize = 10;
        const initialPage = 1;
        // define async function to fetch tenders from the API
        const fetchTenders = async (pageNumber = initialPage) => {
            try {
                // Make a GET request to the API endpoint to fetch tenders
                const response = await axios.get(`${apiURL}/tender/fetch?page=${pageNumber}&pageSize=${pageSize}`);
                const result = response.data;

                // make sure the response data is akways an array
                // if  API returns a single object, wrap it in an array
                const data = Array.isArray(result) ? result : result.data || [];

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
                setPage(result.currentPage || 1);
                setTotalPages(result.totalPages || 1)

            } catch (err) {
                // If the API request fails, log the error and reset the tenders state to empty
                console.error("Failed to fetch tenders:", err);
                setTenders([]);
            }
        };

        // call the async function to initiate the API request
        fetchTenders(page);
    }, [page]); // empty dependency array so this runs only once on component mount

    const removeFilter = (index: number) => {
        setFilters(prev => prev.filter((_, i) => i !== index));
    };

    // FILTERING logic
    const isWithinDays = (dateInput: string | Date, days: number, fromPast = false) => {
        const today = new Date();
        const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
        const diffDays = (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        return fromPast ? diffDays >= 0 && diffDays <= days : diffDays <= days;
    };

    const startsWithLetter = (str: string) => /^[A-Za-z]/.test(str);

    const filteredTenders = tenders
        .filter((tender) => {
            const title = tender.title || "";
            const titleMatch = title.toLowerCase().includes(searchTerm.toLowerCase());

            if (!titleMatch) return false;

            // tag pills
            if (filters.length > 0 && !tender.tag.some((t) => filters.includes(t.name))) {
                return false;
            }

            // overlay status
            if (overlayFilters.status && tender.status !== overlayFilters.status) {
                return false;
            }

            // overlay tags
            if (
                overlayFilters.tags.length > 0 &&
                !overlayFilters.tags.some((t) =>
                    tender.tag.map((tag) => tag.name).includes(t)
                )
            ) {
                return false;
            }

            // overlay date
            if (overlayFilters.date === "Closing Soon" && !isWithinDays(tender.closingDate, 7)) {
                return false;
            }
            if (overlayFilters.date === "Newly Added" && !isWithinDays(tender.publishedDate, 7, true)) {
                return false;
            }

            return true;
        })
        .sort((a, b) => {
            const aTitle = a.title || "";
            const bTitle = b.title || "";

            if (overlayFilters.alphabetical === "A-Z") {
                return aTitle.localeCompare(bTitle, undefined, { sensitivity: "base" });
            }
            if (overlayFilters.alphabetical === "Z-A") {
                return bTitle.localeCompare(aTitle, undefined, { sensitivity: "base" });
            }

            return 0;
        });

    const visibleFilters = filters.slice(0, max_visible_filters);
    const hiddenCount = filters.length - visibleFilters.length;
    const filtersToShow = showAllFilters ? filters : visibleFilters;

    return (
        <div className="discovery-container">

            {toastMessage && (
                <div
                    className={`toast-notification show ${toastMessage.includes("cleared") ? "toast-red" : "toast-green"
                        }`}
                >
                    {toastMessage}
                </div>
            )}

            {/* Login Modal */}
            {loginModalOpen && (
                <Modal
                    isOpen={loginModalOpen}
                    onClose={() => setLoginModalOpen(false)}
                    title="Login Required"
                    message="Please log in to bookmark tenders."
                />
            )}

            <section className="discovery-header">
                <div className="discovery-context">
                    <h1>Discover</h1>
                    <p>Search for public sector tenders in South Africa</p>

                    {/* Filters */}
                    <div className="filter-tags">
                        {filtersToShow.map((filter, index) => (
                            <button key={index} className="filter-tag" onClick={() => removeFilter(index)}>
                                &times; {filter}
                            </button>
                        ))}
                        {!showAllFilters && hiddenCount > 0 && (
                            <button
                                className="filter-tag hidden-count"
                                onClick={() => setShowAllFilters(true)}
                            >
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
                            <FilterOverlay
                                onClose={() => setShowFilterOverlay(false)}
                                onApply={(filters) => {
                                    setOverlayFilters(filters)
                                    showToast("Filters applied!");
                                }}
                                showToast={showToast}
                            />
                        )}
                    </div>
                </div> 
            </section>


            {/* White section for sorting and cards */}
            <section className="discovery-cards-section">
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
                                <TenderCard
                                    key={tender.tenderID}
                                    tender={tender}
                                    isLoggedIn={isLoggedIn}
                                    onRequireLogin={() => setLoginModalOpen(true)}
                                />
                            ))
                        ) : (
                            <div className="spinner-container">
                                <div className="spinner"></div>
                                <p className="loading-text">Loading tenders...</p>
                            </div>
                        )}
                    </div>
                </ErrorBoundary>
            </section>

        </div>
    );
};

export default Discover;
