import React from "react";
import { FaMapMarkerAlt, FaRegClock, FaBookmark, FaBinoculars } from "react-icons/fa";
import "./TenderCard.css";

const TenderCard = ({
    title = "No Title",
    location = "Unknown",
    closing = "Not Provided",
    tags = []
}) => {
    return (
        <div className="tender-card">
            <h2 className="tender-title">{title}</h2>
            <p className="tender-location"><FaMapMarkerAlt /> {location}</p>
            <p className="tender-closing"><FaRegClock /> Closing Info: {closing}</p>
            <div className="tender-tags">
                {(tags || []).map((tag, idx) => (
                    <span
                        key={idx}
                        className={`tag ${tag === "New" ? "tag-new" : "tag-blue"}`}
                    >
                        {tag}
                    </span>
                ))}
            </div>
            <div className="tender-icons">
                <FaBookmark className="icon" />
                <FaBinoculars className="icon" />
            </div>
        </div>
    );
};

export default TenderCard;
