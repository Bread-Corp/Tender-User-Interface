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
    const [totalPages, setTotalPages] = useState(1) 
    const [filter, setFilter] = useState("All"); //state to check which status filter is active
    const [expanded, setExpanded] = useState([]); // state to track which tenders are currently expanded
    const [isLoading, setIsLoading] = useState(true);

    // toggles expansion of a tender card by adding or removing its id
    const toggleExpand = (id) => {
        setExpanded((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    //method to get user watchlist
    useEffect(() => {
        const fetchWatchlist = async () => {

            setIsLoading(true);
            let coreID = null;

            try {
                const attributes = await fetchUserAttributes();

                coreID = attributes['custom:CoreID'];

            } catch (error) {


                if (error.name === 'NotAuthorizedException') {
                    navigate('/login');
                }
                setIsLoading(false);
                return;
            }

            const requestURL = `${apiURL}/watchlist/${coreID}?page=${page}&pageSize=${PAGE_SIZE}`;

            try {
                const response = await axios.get(requestURL);
                const result = response.data;

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

                setTenders(tenderObjects);
                setTotalPages(result.totalPages || 1);
            }
            catch (err) {
                console.error("Error fetching watchlist:", err);
                setTenders([]);
                setTotalPages(1); // reset on error
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchWatchlist();
    }, [page, filter, navigate]);// rerun when page or filter changes


    //////handle remove bookmark
    //const handleBookmarkClick = async (tenderID) => {
    //    let coreID = null;

    //    try {
    //        const attributes = await fetchUserAttributes();
    //        coreID = attributes['custom:CoreID'];
    //    } catch (error) {
    //        // onRequireLogin(); // This function wasn't defined
    //        if (error.name === 'NotAuthorizedException') {
    //            navigate('/login');
    //        }
    //        setIsLoading(false);
    //        return;
    //    }

    //    try {
    //        const response = await axios.post(`${apiURL}/watchlist/togglewatch/${coreID}/${tenderID}`);
    //        // This client-side removal is fine for a quick UI update.
    //        setTenders(prev => prev.filter(t => t.tenderID !== tenderID));
    //    } catch (err) {
    //        console.error("Error removing bookmark:", err);
    //    }
    //};

    const PaginationControls = () => {
        if (totalPages <= 1) return null;

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
                    tenders.length === 0 ? (
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
                            tenders.map((tender) => (
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
                                            <FaMapMarkerAlt /> <span className="tender-info-label">Source: &nbsp; </span>
                                            <span className="tender-info-value">{tender.source || "N/A"} </span>
                                        </p>
                                        <p className="closing-date">
                                            <FaRegClock /><span className="tender-info-label">Closing Date: &nbsp; </span>
                                            <span className="tender-info-value">
                                                {tender.closingDate
                                                    ? tender.closingDate.toLocaleDateString('en-GB', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    }): "N/A"}
                                            </span>
                                        </p>
                                        <div
                                            className="card-actions"
                                            onClick={(e) => e.stopPropagation()}>

                                            <button className="remove-btn" onClick={() => handleBookmarkClick(tender.tenderID)}>
                                                <FaTrashAlt /> Remove
                                            </button>
                                            <button className="tracking-view-btn" onClick={() => navigate(`/tender/${tender.tenderID}`)}>View Tender</button>
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