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
    const [filters, setFilters] = useState < string[] > (["New", "Programming", "Construction", "Emergency", "Green Energy"]);
    const [showAllFilters, setShowAllFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("Popularity");

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
            return;
        }

        const fetchWatchlist = async () => {
            try {
                const attributes = await fetchUserAttributes();
                const coreID = attributes["custom:CoreID"];

                if (coreID) {
                    // fetch the entire watchlist for the user
                    const response = await axios.get(`${apiURL}/watchlist/${coreID}`);
                    const result = response.data.watchlist;

                    const data = Array.isArray(result) ? result : result.data || [];
                    console.log("watchlist data:", data);
                    setWatchlist(data); // store the full watchlist array
                }
            } catch (error) {
                console.error("Failed to fetch user watchlist:", error);
            }
        };

        fetchWatchlist();
        // run whenever the login state changes
    }, [isLoggedIn]);

    // the empty dependency array makes sure it only runs once when the component mounts
    useEffect(() => {
        const fetchTenders = async () => {
            setIsLoading(true);
            try {
                // DTO
                const filterDTO = {
                    page: page,
                    pageSize: pageSize,
                    search: searchTerm,
                    sort: sortOption,
                    tags: filters,
                    dateFilter: overlayFilters.date,
                    tagFilter: overlayFilters.tags,
                    statusFilter: overlayFilters.status,
                    alphaSort : overlayFilters.alphabetical,
                };

                const response = await axios.post(`${apiURL}/tender/fetch`, filterDTO);

                const result = response.data;

                // make sure the response data is always an array
                const data = Array.isArray(result.data) ? result : result.data || [];

                // map over each tender item to convert it into an instance of a class
                const tenderObjects: BaseTender[] = data.map((item: any) => {
                    const tagsArray: Tags[] = item.tags
                        ? item.tags.map((t: any) => new Tags(t.id || "", t.name || ""))
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
                                showToast={showToast}/>
                        )}
                    </div>
                </div> 
            </section>

            {/* white section for sorting and cards */}
            <section className="discovery-cards-section">
                {/* Sorting */}
                <div className="sort-container">
                    <label className="sort-label">Sort by</label>
                    <select
                        className="sort-select"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}>
                        <option>Popularity</option>
                        <option>Date</option>
                        <option>Region</option>
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