import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./Tracking.css";
import { FaMapMarkerAlt, FaRegClock, FaTrashAlt, FaChevronDown, FaRegFolderOpen } from "react-icons/fa";
import axios from 'axios';
import { fetchUserAttributes } from '@aws-amplify/auth';
import { EskomTender } from "../../Models/EskomTender.js";
import { ETender } from "../../Models/eTender.js";
import { BaseTender } from "../../Models/BaseTender.js";
import { Tags } from "../../Models/Tags.js";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";

//required url
const apiURL = import.meta.env.VITE_API_URL;

const PAGE_SIZE = 10;

const Tracking = () => {
    const navigate = useNavigate();

    const [tenders, setTenders] = useState([]); // all fetched tenders
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0) 
    const [filter, setFilter] = useState("All"); //state to check which status filter is active
    const [expanded, setExpanded] = useState([]); // state to track which tenders are currently expanded
    const [isLoading, setIsLoading] = useState(true);

    // toggles expansion of a tender card by adding or removing its id
    const toggleExpand = (id) => {
        setExpanded((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    //filters tenders based on status dropdown
    const filteredTenders =
        filter === "All"
            ? tenders
            : tenders.filter((t) => t.status.toLowerCase() === filter.toLowerCase());

    // slice the filtered array for the current page
    const paginatedTenders = filteredTenders.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    //method to get user watchlist
    useEffect(() => {
        const fetchWatchlist = async () => {

            setIsLoading(true);
            let coreID = null;

            try {
                // Get the logged-in user attributes from Amplify
                const attributes = await fetchUserAttributes();

                //get and set coreID
                coreID = attributes['custom:CoreID'];

            } catch (error) {
                // If the user is not authenticated
                if (error.name === 'NotAuthorizedException') {
                    navigate('/login');
                }
                setIsLoading(false);
                return;
            }

            //now we can use the coreID to get the user's saved tenders
            try {
                // request API to fetch ALL tracked items
                const response = await axios.get(`${apiURL}/watchlist/${coreID}`);
                const result = response.data;

                // make sure the response data is always an array
                const data = Array.isArray(result) ? result : result.data || [];

                // map over each tender item to convert it into an instance of a class
                const tenderObjects = data.map((item) => {
                    // Explicitly resolve the ID as a fallback
                    const id = item.tenderID || item.TenderID || item.id;

                    // convert the tags array into an array of Tag instances
                    const tagsArray = item.tags
                        ? item.tags.map((t) => new Tags(t.id || "", t.name || ""))
                        : [];

                    // decide which class to instantiate based on the source of the tender
                    if (item.source === "Eskom") {
                        return new EskomTender({
                            ...item,
                            tenderID: id,
                            tag: tagsArray,
                            source: item.source
                        });
                    } else {
                        return new ETender({
                            ...item,
                            tenderID: id,
                            tag: tagsArray,
                            source: item.source || "ETender"
                        });
                    }
                });

                // update the state to store the fetched and processed tenders
                setTenders(tenderObjects);
            }
            catch (err) {
                // If the API request fails, log the error and reset the tenders state to empty
                console.error("Failed to fetch tenders:", err);
                setTenders([]);
            }
            finally {
                setIsLoading(false);
            }
        };

        // call the async function to initiate the API request
        fetchWatchlist();
    }, []); // empty dependency array so this runs only once on component mount

    useEffect(() => {
        const newTotalPages = Math.ceil(filteredTenders.length / PAGE_SIZE);
        setTotalPages(newTotalPages === 0 ? 1 : newTotalPages);

        if (page > newTotalPages && newTotalPages > 0) {
            setPage(1);
        }

    }, [filteredTenders, filter, page]);

    //handle remove bookmark
    const handleBookmarkClick = async (tenderID) => {
        let coreID = null;

        try {
            const attributes = await fetchUserAttributes();
            coreID = attributes['custom:CoreID'];

        } catch (error) {
            onRequireLogin();
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${apiURL}/watchlist/togglewatch/${coreID}/${tenderID}`);

            setTenders(prev => prev.filter(t => t.tenderID !== tenderID));
        } catch (err) {
        }
    };

    const PaginationControls = () => {
        if (totalPages <= 1 && filteredTenders.length <= PAGE_SIZE) return null;

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
                        onClick={() => setPage(i)}
                        disabled={isLoading}
                    >
                        {i}
                    </button>
                );
            } else if (
                (i === 2 && page > 3)
                || (i === totalPages - 1 && page < totalPages - 2)
            ) {
                if (!pages.find(p => p.props.className?.includes('ellipsis') && p.key === i)) {
                    pages.push(
                        <span key={i} className="ellipsis">...</span>
                    );
                }
            }
        }

        return (
            <div className="pagination">
                <button
                    disabled={page === 1 || isLoading}
                    onClick={() => setPage(page - 1)}
                    className="pagination-btn">
                    &laquo;
                </button>

                {pages.filter(p => p !== null)}

                <button
                    disabled={page === totalPages || isLoading}
                    onClick={() => setPage(page + 1)}
                    className="pagination-btn">
                    &raquo;
                </button>
            </div>
        );
    };

    return (
        <div className="tracking-container">
            <div className="tracking-header">
                <h1 className="tracking-title">Tracked Tenders</h1>
                <p className="tracking-subtitle">View the tenders you are monitoring</p>
            </div>

            <div className="filter-container">
                <label htmlFor="statusFilter">Filter by Status:</label>
                <select
                    id="statusFilter"
                    onChange={(e) => {
                        setFilter(e.target.value);
                        setPage(1);
                    }}
                    value={filter}>

                    <option value="All">All</option>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                </select>
            </div>

            <div className="tender-grid">
                {isLoading ? (
                    <div className="loading-wrapper">
                        <LoadingSpinner text="Loading your tracked tenders..." />
                    </div>
                ) :
                    filteredTenders.length === 0 ? (
                        <div className="empty-state-message">
                            <span className="empty-state-icon">
                                <FaRegFolderOpen />
                            </span>

                            <h2>No Tenders Found</h2>
                            <p>We couldn't find any results matching your current filters or search query.</p>
                            <button onClick={() => navigate('/discover')} className="btn-secondary-dark">
                                Discover New Tenders
                            </button>
                        </div>
                    ) : (
                        paginatedTenders.map((tender) => (
                            <div
                                className="tracking-tender-card"
                                key={tender.tenderID}>

                                <div className="card-header">
                                    <h3>{tender.title}</h3>
                                    <div className="card-header-right">
                                        <span className={`status-badge ${tender.status.toLowerCase()}`}>
                                            {tender.status}
                                        </span>
                                        <FaChevronDown
                                            className={`expand-icon ${expanded.includes(tender.tenderID) ? "rotated" : ""}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleExpand(tender.tenderID);
                                            }}
                                        />
                                    </div>
                                </div>

                                {expanded.includes(tender.tenderID) && (
                                    <>
                                        <p className="location">
                                            <FaMapMarkerAlt /> {tender.location}
                                        </p>
                                        <p className="closing-date">
                                            <FaRegClock /> Closing: {tender.closing}
                                        </p>
                                        <div
                                            className="card-actions"
                                            onClick={(e) => e.stopPropagation()}>

                                            <button className="remove-btn" onClick={() => handleBookmarkClick(tender.tenderID)}>
                                                <FaTrashAlt /> Remove
                                            </button>
                                            <button className="view-btn">View Tender</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    )}
            </div>

            {!isLoading && <PaginationControls />}

        </div>
    );
};

export default Tracking;