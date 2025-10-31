import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { EskomTender } from "../../Models/EskomTender.js";
import { ETender } from "../../Models/ETender.js";
import { SanralTender } from "../../Models/SanralTender.js";
import { TransnetTender } from "../../Models/TransnetTender.js";
import { Tags } from "../../Models/Tags.js";
import "./TenderDetails.css";

const apiURL = import.meta.env.VITE_API_URL;

const TenderDetails: React.FC = () => {
    const { id } = useParams();
    const [tender, setTender] = useState<EskomTender | ETender | SanralTender | TransnetTender | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTender = async () => {
            try {
                const response = await axios.get(`${apiURL}/tender/fetch/${id}`);
                const item = response.data;

                console.log("Raw tender data from API:", item);

                const tagsArray: Tags[] = item.tags
                    ? item.tags.map((t: any) => new Tags(t.tagID || "", t.tagName || ""))
                    : [];

                let tenderObj;
                if (item.source === "Eskom") {
                    tenderObj = new EskomTender({ ...item, tag: tagsArray });
                } else if (item.source === "SANRAL") {
                    tenderObj = new SanralTender({ ...item, tag: tagsArray });
                } else if (item.source === "Transnet") {
                    tenderObj = new TransnetTender({ ...item, tag: tagsArray });
                } else {
                    tenderObj = new ETender({ ...item, tag: tagsArray });   
                }

                setTender(tenderObj);
            } catch (err) {
                console.error("Error fetching tender details:", err);
                setError("Failed to load tender details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchTender();
    }, [id]);

    if (loading) {
        return (
            <div className="tender-details-loading">
                <div className="spinner"></div>
                <p>Loading tender details...</p>
            </div>
        );
    }

    if (error) {
        return <p className="tender-details-error">{error}</p>;
    }

    if (!tender) {
        return <p className="tender-details-error">Tender not found.</p>;
    }

    return (
        <div className="tender-details-container">

            <h1>{tender.title}</h1>

            {/* Tags */}
            {tender.tag?.length > 0 && (
                <div className="tags-container">
                    {tender.tag.map((t: Tags) => (
                        <span key={t.id} className="tag">
                            {t.TagName}
                        </span>
                    ))}
                </div>
            )}

            {/* General Information */}
            <div className="tender-detail-card ">
                <h2>General Information</h2>
                <p><strong>Tender ID:</strong> {tender.tenderID}</p>
                <p><strong>Status:</strong> {tender.status}</p>
                <p><strong>Published:</strong> {tender.publishedDate?.toDateString()}</p>
                <p><strong>Closing:</strong> {tender.closingDate?.toDateString()}</p>
                <p><strong>Source:</strong> {tender.source}</p>
            </div>

            {/* Description */}
            {tender.description && (
                <div className="tender-detail-card ">
                    <h2>Description</h2>
                    <p>{tender.description}</p>
                </div>
            )}

            {/* DYNAMIC CONTENT */}

            {/* SANRAL Full Text Notice Card */}
            {tender instanceof SanralTender && tender.fullTextNotice && (
                <div className="tender-detail-card ">
                    <h2>Full Text Notice</h2>
                    <p>{tender.fullTextNotice}</p>
                </div>
            )}

            {/* Eskom Extra Details Card */}
            {tender instanceof EskomTender && (
                <div className="tender-detail-card ">
                    <h2>Extra Details</h2>
                    <p><strong>Tender Number:</strong> {tender.tenderNumber}</p>
                    <p><strong>Reference:</strong> {tender.reference || "N/A"}</p>
                    <p><strong>Audience:</strong> {tender.audience}</p>
                    <p><strong>Office Location:</strong> {tender.officeLocation}</p>
                    <p><strong>Email:</strong> {tender.email || "N/A"}</p>
                    <p><strong>Address:</strong> {tender.address || "N/A"}</p>
                    <p><strong>Province:</strong> {tender.province}</p>
                </div>
            )}

            {/* SANRAL Extra Details Card */}
            {tender instanceof SanralTender && (
                <div className="tender-detail-card ">
                    <h2>Extra Details</h2>
                    <p><strong>Tender Number:</strong> {tender.tenderNumber}</p>
                    <p><strong>Category:</strong> {tender.category}</p>
                    <p><strong>Location:</strong> {tender.location}</p>
                    <p><strong>Email:</strong> {tender.email || "N/A"}</p>
                </div>
            )}

            {tender instanceof ETender && (
                <div className="tender-detail-card ">
                    <h2>Extra Details</h2>
                    <p><strong>Tender Number:</strong> {tender.tenderNumber}</p>
                    <p><strong>Audience:</strong> {tender.audience}</p>
                    <p><strong>Office Location:</strong> {tender.officeLocation}</p>
                    <p><strong>Email:</strong> {tender.email || "N/A"}</p>
                    <p><strong>Address:</strong> {tender.address || "N/A"}</p>
                    <p><strong>Province:</strong> {tender.province}</p>
                </div>
            )}

            {tender instanceof TransnetTender && (
                <div className="tender-detail-card ">
                    <h2>Extra Details</h2>
                    <p><strong>Tender Number:</strong> {tender.tenderNumber}</p>
                    <p><strong>Category:</strong> {tender.category}</p>
                    <p><strong>Region:</strong> {tender.region}</p>
                    <p><strong>Institution:</strong> {tender.institution}</p>
                    <p><strong>Tender Type:</strong> {tender.tenderType}</p>
                    <p><strong>Contact Person:</strong> {tender.contactPerson}</p>
                    <p><strong>Email:</strong> {tender.email || "N/A"}</p>
                    </div>
            )}

            {/* Supporting Docs */}
            {Array.isArray(tender.supportingDocs) && tender.supportingDocs.length > 0 && (
                <div className="tender-detail-card ">
                    <h2 style={{ marginBottom: '1.8rem' }}>Supporting Documents</h2>
                    {/* Map over the array */}
                    {tender.supportingDocs.map((doc) => (
                        // Use doc.supportingDocID or doc.url as the key
                        <a
                            key={doc.supportingDocID}
                            href={doc.url} // Use the doc's URL
                            target="_blank"
                            rel="noreferrer"
                            className="btn-secondary-dark supporting-doc-link" // Add a class for potential styling
                        >
                            {doc.name} {/* Use the doc's name as the link text */}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TenderDetails;
