import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchUserAttributes } from '@aws-amplify/auth';
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
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner.jsx";

const apiURL = import.meta.env.VITE_API_URL;

const max_visible_filters = 4;
const pageSize = 10;
 
const Discover = ({ onNewNotif }) => {
    const [showFilterOverlay, setShowFilterOverlay] = useState(false);
    const [filters, setFilters] = useState<string[]>([]);
    const [showAllFilters, setShowAllFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("Descending");

    // pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const [tenders, setTenders] = useState<(EskomTender | ETender)[]>([]);
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("userToken"));
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    // overlay filter state
    const [overlayFilters, setOverlayFilters] = useState<{
        date: string | null;
        tags: string[];
        alphabetical: string | null;
        status: string | null;
        sources: string[];
    }>({
        date: null,
        tags: [],
        alphabetical: null,
        status: null,
        sources: [],
    });

    // hlper for toast message
    const showToast = (message: string, duration = 2000) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), duration);
    };

    //hlper for new notif
    const helpNewNotif = () => {
        onNewNotif();
    }

    // Apply dark mode from localStorage
    useEffect(() => {
        const storedMode = localStorage.getItem("darkMode");
        document.body.classList.toggle("dark-mode", storedMode === "true");
    }, []);

    // fetch the watchlist when the user logs in
    useEffect(() => {
        console.log("Fetching watchlist:", isLoggedIn);
        if (!isLoggedIn) {
            setWatchlist([]); // clear watchlist if user logs out
            setFilters([]);
            return;
        }

        const fetchUserData = async () => {
            try {
                const attributes = await fetchUserAttributes();
                const coreID = attributes["custom:CoreID"];

                if (coreID) {

                    const watchlistResponse = await axios.get(`${apiURL}/watchlist/${coreID}`);
                    const watchlistResult = watchlistResponse.data.watchlist;
                    const watchlistData = Array.isArray(watchlistResult) ? watchlistResult : watchlistResult.data || [];
                    console.log("watchlist data:", watchlistData);
                    setWatchlist(watchlistData);

                    try {
                        const tagsResponse = await axios.get(`${apiURL}/tenderuser/fetchtags/${coreID}`);

                        const userTagList = tagsResponse.data.tags;

                        const userTagObjects = (Array.isArray(userTagList) && userTagList.length > 0)
                            ? userTagList[0]
                            : [];

                        const userTags = Array.isArray(userTagObjects)
                            ? userTagObjects.map(tagObject => tagObject.tagName)
                            : [];

                        if (userTags.length > 0) {
                            console.log("Setting user tags as filters:", userTags);
                            setFilters(userTags); 
                        } else {
                            console.log("No user tags found, applying no filters.");
                            setFilters([]);
                        }
                    } catch (tagError) {
                        console.error("Failed to fetch user tags:", tagError);
                        setFilters([]);
                    }

                } else {
                    // no coreID found
                    setFilters([]);
                }
            } catch (error) {
                console.error("Failed to fetch user attributes or watchlist:", error);
                setFilters([]);
            }
        };

        fetchUserData();
        // run whenever the login state changes
    }, [isLoggedIn, apiURL]);

    useEffect(() => {
        const fetchTenders = async () => {
            setIsLoading(true);
            try {

                // DTO
                const filterDTO = {
                    search: searchTerm,
                    sort: sortOption, //sort dropdown options
                    tags: filters,
                    dateFilter: overlayFilters.date, // closing soon < 7 days
                    tagFilter: overlayFilters.tags, // tags applied from overlay
                    statusFilter: overlayFilters.status ? overlayFilters.status.toLowerCase() : null, // open or closed
                    alphaSort: overlayFilters.alphabetical, //alphabetical sorting
                    sources: overlayFilters.sources,
                };

                console.log("Sending to API:", filterDTO);

                const requestURL = `${apiURL}/tender/fetchFiltered?page=${page}&pageSize=${pageSize}`;
                const response = await axios.post(requestURL, filterDTO, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                const result = response.data;

                // Get the array from result.data, or default to an empty array
                const data = Array.isArray(result.data) ? result.data : [];

                console.log("API Result:", result);
                console.log("Extracted Data for Mapping:", data)

                // map over each tender item to convert it into an instance of a class
                const tenderObjects: BaseTender[] = data.map((item: any) => {

                    console.log(`Tags for tender ${item.title}:`, item.tags);

                    const tagsArray: Tags[] = item.tags
                        ? item.tags.map((t: any) => new Tags(t.tagOD || "", t.tagName || ""))
                        : [];

                    if (item.source === "Eskom") {
                        return new EskomTender({ ...item, tag: tagsArray, source: item.source });
                    } else {
                        return new ETender({ ...item, tag: tagsArray, source: item.source || "ETender" });
                    }
                });

                setTenders(tenderObjects);
                setTotalPages(result.totalPages || 0);
            } catch (err) {
                console.error("Failed to fetch all tenders:", err);
                setTenders([]);
                setTotalPages(0);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTenders();
    }, [page, searchTerm, sortOption, filters, overlayFilters]); 

    const removeFilter = (index: number) => {
        setFilters(prev => prev.filter((_, i) => i !== index));
    };

    const visibleFilters = filters.slice(0, max_visible_filters);
    const hiddenCount = filters.length - visibleFilters.length;
    const filtersToShow = showAllFilters ? filters : visibleFilters;

    return (
        <div className="discovery-container">

            {toastMessage && (
                <div
                    className={`toast-notification show ${toastMessage.includes("cleared") ? "toast-red" : "toast-green"
                        }`}>{toastMessage}
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
                                onClick={() => setShowAllFilters(true)}>
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
                                onChange={(e) => setSearchTerm(e.target.value)}/>
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
                                availableTags={filters}
                            />
                        )}
                    </div>
                </div> 
            </section>

            {/* white section for sorting and cards */}
            <section className="discovery-cards-section">
                {/* Sorting */}
                <div className="sort-container">
                    <label className="sort-label">Sort by Date</label>
                    <select
                        className="sort-select"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}>
                        <option>Ascending</option>
                        <option>Descending</option>
                    </select>
                </div>

                {/* Tender Cards */}
                <ErrorBoundary>
                    <div className="tender-list">
                        {isLoading ? (
                            // show spinner while data being fetched
                            <LoadingSpinner text="Loading tenders..." />
                        ) : tenders.length > 0 ? (
                            // show tenders if loading is false and we have results
                            tenders.map((tender) => (
                                <TenderCard
                                    key={tender.tenderID}
                                    tender={tender}
                                    isLoggedIn={isLoggedIn}
                                    onNewNotif={helpNewNotif}
                                    watchlistArray={watchlist}
                                    onRequireLogin={() => setLoginModalOpen(true)}
                                    onBookmarkSuccess={(tenderTitle, isAdded) => {
                                        if (isAdded) {
                                            showToast(`'${tenderTitle}' added to watchlist!`, 3000);
                                        } else {
                                            // Assuming you handle removal too
                                            showToast(`'${tenderTitle}' removed from watchlist.`, 3000);
                                        }
                                    }}
                                />
                            ))
                        ) : (
                                    <div className="empty-state-message">
                                        <span className="empty-state-icon">
                                            <FaSearch /> 
                                        </span>

                                        <h2>No Results Found</h2>
                                        <p>We couldn't find any tenders matching your current filters or search term. Try adjusting your criteria.</p>
                                    </div>
                        )}

                        {/* only show pagination when there are tenders */}
                        {tenders.length > 0 && (
                            <div className="pagination">
                                {/* Previous button */}
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                    className="pagination-btn">
                                    &laquo;
                                </button>

                                {/* page numbers with ellipses */}
                                {(() => {
                                    const pages = [];
                                    for (let i = 1; i <= totalPages; i++) {
                                        if (
                                            i === 1 ||
                                            i === totalPages ||
                                            (i >= page - 1 && i <= page + 1)
                                        ) {
                                            pages.push(
                                                <button
                                                    key={i}
                                                    className={`pagination-btn page-number ${page === i ? "active" : ""}`}
                                                    onClick={() => setPage(i)}>{i}
                                                </button>
                                            );
                                        } else if (
                                            (i === 2 && page > 3) ||
                                            (i === totalPages - 1 && page < totalPages - 2)
                                        ) {
                                            pages.push(
                                                <span key={i} className="ellipsis">...</span>
                                            );
                                        }
                                    }
                                    return pages;
                                })()}

                                {/* > button */}
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => setPage(page + 1)}
                                    className="pagination-btn">
                                    &raquo;
                                </button>
                            </div>
                        )}
                    </div>
                </ErrorBoundary>
            </section>

        </div>
    );
};

export default Discover;