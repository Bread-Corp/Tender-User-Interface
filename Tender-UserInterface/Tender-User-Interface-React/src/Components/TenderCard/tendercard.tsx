import React, { useState } from "react";
import { FaMapMarkerAlt, FaRegClock, FaBookmark, FaBinoculars } from "react-icons/fa";
import "./TenderCard.css";
import { BaseTender } from "../../Models/BaseTender.js";
import { Tags } from "../../Models/Tags.js";

type TenderCardProps = {
    tender?: BaseTender; // optional in case data is not loaded yet
};

const MAX_TITLE_LENGTH = 100; // number of characters before truncation

const TenderCard: React.FC<TenderCardProps> = ({ tender }) => {
    const [expanded, setExpanded] = useState(false);

    if (!tender) {
        return <div className="tender-card">Loading tender...</div>; // fallback UI
    }

    const title = tender.title || "No Title";
    const isLong = title.length > MAX_TITLE_LENGTH;
    const displayedTitle = expanded || !isLong
        ? title
        : title.slice(0, MAX_TITLE_LENGTH) + "...";

    return (
        <div className="tender-card">
            <h2 className="tender-title">
                {displayedTitle}
                {isLong && (
                    <button
                        className={`read-more-btn ${expanded ? "show-less" : ""}`}
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? " Show less" : " Read more"}
                    </button>
                )}
            </h2>

            <p className="tender-location">
                <FaMapMarkerAlt /> {tender.source || "Unknown"}
            </p>

            <p className="tender-closing">
                <FaRegClock /> Closing:{" "}
                {tender.closingDate ? tender.closingDate.toLocaleDateString() : "N/A"}{" "}
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

            <div className="tender-icons">
                <FaBookmark className="icon" />
                <FaBinoculars className="icon" />
            </div>
        </div>
    );
};

export default TenderCard;
