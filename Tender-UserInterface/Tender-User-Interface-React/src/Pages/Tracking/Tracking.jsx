import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./Tracking.css";
import { FaMapMarkerAlt, FaRegClock, FaTrashAlt, FaChevronDown } from "react-icons/fa";
import axios from 'axios';
import { fetchUserAttributes } from '@aws-amplify/auth';
import { EskomTender } from "../../Models/EskomTender.js";
import { ETender } from "../../Models/eTender.js";
import { BaseTender } from "../../Models/BaseTender.js";
import { Tags } from "../../Models/Tags.js";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";

//required url
const apiURL = import.meta.env.VITE_API_URL;

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
    const navigate = useNavigate();

    const [tenders, setTenders] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0)
    // state to track which status filter is active
    const [filter, setFilter] = useState("All");
    // state to track which tenders are currently expanded
    const [expanded, setExpanded] = useState([]);
    // state to track coreID
    const [ID, setID] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // updates the note field for a tender with matching id
    const updateNote = (id, value) => {
        setTenders((prev) =>
            prev.map((t) => (t.tenderID === id ? { ...t, note: value } : t))
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

    //method to get user watchlist
    useEffect(() => {
        const pageSize = 10;
        const initialPage = 1;
        const fetchWatchlist = async (pageNumber = initialPage) => {
            //get coreID from auth context
            let coreID = null;

            try {
                // Get the logged-in user attributes from Amplify
                const attributes = await fetchUserAttributes();
                console.log("attributes:", attributes);

                //get and set coreID
                coreID = attributes['custom:CoreID'];
                console.log("CoreID:", coreID);

            } catch (error) {
                console.error("Error fetching CoreID:", error);
                if (error.name === 'NotAuthorizedException') {
                    navigate('/login');
                }
                return;
            }

            //now we can use the coreID to get the user's saved tenders
            try {
                //request API
                const response = await axios.get(`${apiURL}/watchlist/${coreID}`);
                const result = response.data;

                // make sure the response data is akways an array
                // if  API returns a single object, wrap it in an array
                const data = Array.isArray(result) ? result : result.data || [];

                // map over each tender item to convert it into an instance of a class
                const tenderObjects = data.map((item) => {
                    // convert the tags array into an array of Tag instances
                    // if the item has tags, map them - otherwise use emtpy array
                    const tagsArray = item.tags
                        ? item.tags.map((t) => new Tags(t.id || "", t.name || ""))
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
        fetchWatchlist(page);
    }, [page]);

    //handle remove bookmark
    const handleBookmarkClick = async (tenderID) => {
        //get coreID from auth context
        let coreID = null;

        try {
            // Get the logged-in user attributes from Amplify
            const attributes = await fetchUserAttributes();
            console.log("attributes:", attributes);

            //get and set coreID
            coreID = attributes['custom:CoreID'];
            console.log("CoreID:", coreID);

        } catch (error) {
            console.error("Error fetching CoreID:", error);
            onRequireLogin();
            setIsLoading(false);
            return;
        }

        try {
            // Make a POST request to the API endpoint to togglewatch
            const response = await axios.post(`${apiURL}/watchlist/togglewatch/${coreID}/${tenderID}`);

            // placeholder + logs
            setTenders(prev => prev.filter(t => t.tenderID !== tenderID));
            console.log("Bookmark removed", tenderID);

        } catch (err) {
            // If the API request fails, log the error and reset the tenders state to empty
            console.error("Failed to toggle watch:", err);
        }
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
            onChange={(e) => setFilter(e.target.value)}
                    value={filter}>

            <option value="All">All</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
        </select>
    </div>

            <div className="tender-grid">
                {/* loading spinner rendered*/}

                {isLoading ? (
                    <div className="loading-wrapper">
                        <LoadingSpinner text="Loading your tracked tenders..." />
                    </div>
                ) : // message for no results
                    filteredTenders.length === 0 ? (

                        <div className="no-tenders">
                            <p>You are not currently tracking any tenders.</p>
                            <button onClick={() => navigate('/discover')} className="discover-btn">
                                Discover New Tenders
                            </button>
                        </div>
                    ) : (
                        // tender cards
                        filteredTenders.map((tender) => (
                            <div
                                className="tracking-tender-card"
                                key={tender.tenderID}>

                        {/* card header displays title status + expand icon */}
                        <div className="card-header">
                            <h3>{tender.title}</h3>
                            <div className="card-header-right">
                                <span className={`status-badge ${tender.status.toLowerCase()}`}>
                                    {tender.status}
                                </span>
                                {/* rotate aroow when expanded */}
                                <FaChevronDown
                                    className={`expand-icon ${expanded.includes(tender.tenderID) ? "rotated" : ""}`}
                                    onClick={(e) => {
                                        e.stopPropagation(); // prevent triggering any parent clicks
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
                                {/* prevents parent card click from collapsing when clicking inside buttons */}
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
        </div>
    );
};

export default Tracking;
