import React, { useState } from "react";
import { FaMapMarkerAlt, FaRegClock, FaBookmark, FaBinoculars } from "react-icons/fa";
import "./TenderCard.css";
import { BaseTender } from "../../Models/BaseTender.js";
import { Tags } from "../../Models/Tags.js";
import { Link } from "react-router-dom";

type TenderCardProps = {
    tender?: BaseTender;
};

const MAX_TITLE_LENGTH = 100;

const TenderCard: React.FC<TenderCardProps> = ({ tender }) => {
    const [expanded, setExpanded] = useState(false);

    if (!tender) {
        return <div className="tender-card">Loading tender...</div>;
    }

    const [titleExpanded, setTitleExpanded] = useState(false); // for title


    const title = tender.title || "No Title";
    const isLong = title.length > MAX_TITLE_LENGTH;
    const displayedTitle =
        titleExpanded || !isLong ? title : title.slice(0, MAX_TITLE_LENGTH) + "...";

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

                    {/* Link to full details page */}
                    <Link to={`/tender/${tender.tenderID}`} className="see-more-btn">
                        See Full Tender
                    </Link>
                </div>
            )}

            {/* Action icons */}
            <div className="tender-icons">
                {/* Binoculars now toggle the expanded state */}
                <FaBinoculars
                    className={`icon binoculars ${expanded ? "rotated" : ""}`}
                    onClick={() => {
                        const newState = !expanded;
                        setExpanded(newState);       // expand/collapse details
                        setTitleExpanded(newState);  // expand/collapse title
                    }}
                    style={{ cursor: "pointer" }}
                />
                <FaBookmark className="icon" />
            </div>
        </div>
    );
};

export default TenderCard;
