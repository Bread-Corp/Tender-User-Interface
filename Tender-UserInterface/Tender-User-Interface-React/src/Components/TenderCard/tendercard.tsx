import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchUserAttributes } from '@aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaRegClock, FaRegBookmark, FaBookmark, FaBinoculars } from "react-icons/fa";
import "./TenderCard.css";
import { BaseTender } from "../../Models/BaseTender.js";
import { Tags } from "../../Models/Tags.js";
import { Link } from "react-router-dom";

type WatchlistItem = {
    tenderID: string;
    // other fields - add later, this is for TS safety
};

type TenderCardProps = {
    tender?: BaseTender;
    isLoggedIn: boolean;
    watchlistArray: WatchlistItem[];
    onRequireLogin: () => void;
    onBookmarkSuccess: (tenderTitle: string, isAdded: boolean) => void;
};

const MAX_TITLE_LENGTH = 100;
const apiURL = import.meta.env.VITE_API_URL;

const TenderCard: React.FC<TenderCardProps> = ({ tender, isLoggedIn, watchlistArray, onRequireLogin, onBookmarkSuccess }) => {
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);

    if (!tender) {
        return <div className="tender-card">Loading tender...</div>;
    }

    const [titleExpanded, setTitleExpanded] = useState(false); // for title
    const [bookmarked, setBookmarked] = useState(false); // for bookmark

    const title = tender.title || "No Title";
    const isLong = title.length > MAX_TITLE_LENGTH;
    const displayedTitle =
        titleExpanded || !isLong ? title : title.slice(0, MAX_TITLE_LENGTH) + "...";


    // prepping for saving logic
    //useEffect(() => {
    //    console.log(`Bookmark state for ${tender.tenderID}:`, bookmarked);
    //}, [bookmarked, tender.tenderID]);

    // Load initial bookmark state if logged in
    useEffect(() => {
        console.log(`Bookmark prefetch for ${tender.tenderID}:`, bookmarked);
        //if (!isLoggedIn) return;

        const fetchBookmarkState = async () => {
            try {
                const attributes = await fetchUserAttributes();
                console.log("Attributes on page load:", attributes);
                const coreID = attributes["custom:CoreID"];
                if (!coreID) {
                    console.warn("No CoreID found for user");
                    return;
                }

                // Call the backend to get the watchlist entry for this tender
                const response = await axios.get(`${apiURL}/watchlist/${coreID}`);
                console.log(`GET watchlist response for user: ${coreID}:`, response.data);

                const result = response.data;

                // make sure the response data is akways an array
                // if  API returns a single object, wrap it in an array
                const data = Array.isArray(result) ? result : result.data || []

                if (true) {
                    watchlistArray.forEach((item) => {
                        if (item.tenderID === tender.tenderID) {
                            setBookmarked(true);
                        }
                    });
                    
                    console.log(`Fetched bookmark state for ${tender.tenderID}:`, bookmarked);
                }

            } catch (error) {
                console.error("Failed to fetch initial bookmark state:", error);
            }
        };

        fetchBookmarkState();
    }, [bookmarked, isLoggedIn, tender.tenderID]);


    const handleBookmarkClick = async () => {
        //get coreID from auth context
        let coreID = null;

        try {
            // Get the logged-in user attributes from Amplify
            const attributes = await fetchUserAttributes();
            console.log("attributes:", attributes);

            // directly access the custom attribute
            coreID = attributes["custom:CoreID"];
            console.log("CoreID:", coreID);

            if (!coreID) {
                console.error("No CoreID found");
                return;
            }

        } catch (error) {
            console.error("Error fetching CoreID:", error);
            onRequireLogin();
            return;
        }

        //toggle watch endpoint
        try {
            const response = await axios.post(`${apiURL}/watchlist/togglewatch/${coreID}/${tender.tenderID}`);
            console.log("POST /togglewatch response:", response.data);

            // placeholder + logs
            setBookmarked(prev => {
                const newBookmarkedState = !prev;

                onBookmarkSuccess(tender.title, newBookmarkedState);

                return newBookmarkedState;
            });

        } catch (err) {
            // If the API request fails, log the error and reset the tenders state to empty
            console.error("Failed to toggle watch:", err);
        }
    };

    return (
        <div className="tender-card">
            {/* Header */}
            <div className="tender-card-header">
                <h2 className="tender-title">
                    {displayedTitle}
                    {isLong && !titleExpanded && (
                        <button
                            className="read-more-btn"
                            onClick={() => setTitleExpanded(true)}>Read more
                        </button>
                    )}
                </h2>
            </div>

            {/* Quick info */}
            <p className="tender-location">
                <FaMapMarkerAlt /> {tender.source || "Unknown"}
            </p>

            <p className="tender-closing">
                <FaRegClock /> Closing:{" "}
                {tender.closingDate
                    ? tender.closingDate.toLocaleDateString()
                    : "N/A"}{" "}
                {tender.isClosed() ? "(Closed)" : "(Open)"}
            </p>

            <div className="tender-tags">
                {tender.tag?.length ? (
                    tender.tag.map((tag: Tags, idx: number) => (
                        <span
                            key={idx}
                            className={`tag ${tag.name === "New" ? "tag-new" : "tag-blue"}`}
                        >
                            {tag.name}
                        </span>
                    ))
                ) : (
                    <span className="tag tag-gray">No Tags</span>
                )}
            </div>

            {/* Expanded details */}
            {expanded && (
                <div className="tender-expanded">
                    <h3 className="tender-details-heading">Tender Details</h3>

                    <div className="tender-info-row">
                        <span className="tender-info-label">ID:</span>
                        <span className="tender-info-value">{tender.tenderID}</span>
                    </div>

                    <div className="tender-info-row">
                        <span className="tender-info-label">Status:</span>
                        <span className="tender-info-value">{tender.status}</span>
                    </div>

                    <div className="tender-info-row">
                        <span className="tender-info-label">Published:</span>
                        <span className="tender-info-value">{tender.publishedDate?.toDateString()}</span>
                    </div>

                    <div className="tender-info-row">
                        <span className="tender-info-label">Closing Date:</span>
                        <span className="tender-info-value">{tender.closingDate?.toDateString()}</span>
                    </div>

                    <div className="tender-info-row">
                        <span className="tender-info-label">Description:</span>
                        <span className="tender-info-value">{tender.description || "N/A"}</span>
                    </div>

                    <Link to={`/tender/${tender.tenderID}`} className="see-more-btn">
                        See Full Tender
                        <span className="arrow"></span>
                    </Link>
                </div>
            )}

            {/* Action icons */}
            <div className="tender-icons">
                <FaBinoculars className={`icon binoculars ${expanded ? "rotated" : ""}`}
                    onClick={() => { const newState = !expanded; setExpanded(newState); setTitleExpanded(newState); }} // expand and collapse details + title if cut off
                    style={{ cursor: "pointer" }} />
                {bookmarked
                    ? <FaBookmark className="icon bookmarked" onClick={handleBookmarkClick} style={{ cursor: "pointer" }} />
                    : <FaRegBookmark className="icon" onClick={handleBookmarkClick} style={{ cursor: "pointer" }} />
                }
            </div>
        </div>
    );
};

export default TenderCard;