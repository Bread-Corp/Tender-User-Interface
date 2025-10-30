import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { EskomTender } from "../../Models/EskomTender.js";
import { ETender } from "../../Models/eTender.js";
import { Tags } from "../../Models/Tags.js";
import "./TenderDetails.css";

const apiURL = import.meta.env.VITE_API_URL;

const TenderDetails: React.FC = () => {
    const { id } = useParams();
    const [tender, setTender] = useState<EskomTender | ETender | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTender = async () => {
            try {
                const response = await axios.get(`${apiURL}/tender/fetch/${id}`);
                const item = response.data;

                const tagsArray: Tags[] = item.tags
                    ? item.tags.map((t: any) => new Tags(t.tagID || "", t.tagName || ""))
                    : [];

                const tenderObj =
                    item.source === "Eskom"
                        ? new EskomTender({ ...item, tag: tagsArray })
                        : new ETender({ ...item, tag: tagsArray });

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

    const extraDetails = [
        { label: "Tender Number", value: (tender as any).tenderNumber },
        { label: "Reference", value: (tender as any).reference || "N/A" },
        { label: "Audience", value: (tender as any).audience },
        { label: "Office Location", value: (tender as any).officeLocation },
        { label: "Email", value: (tender as any).email || "N/A" },
        { label: "Address", value: (tender as any).address },
        { label: "Province", value: (tender as any).province },
    ];

    return (
        <div className="tender-details-container">

            {/* Return button */}
            {/*<div className="return-home-wrapper">*/}
            {/*    <Link to="/discover" className="return-home-btn">*/}
            {/*        Back to Discover*/}
            {/*    </Link>*/}
            {/*</div>*/}

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

            {/* Extra Details */}
            {"tenderNumber" in tender && (
                <div className="tender-detail-card ">
                    <h2>Extra Details</h2>
                    {extraDetails.map((field) => (
                        <p key={field.label}>
                            <strong>{field.label}:</strong> {field.value}
                        </p>
                    ))}
                </div>
            )}

            {/* Supporting Docs */}
            {Array.isArray(tender.supportingDocs) && tender.supportingDocs.length > 0 && (
                <div className="tender-detail-card ">
                    <h2 style={{ marginBottom: '1.8rem' }}>Supporting Documents</h2>
                    {/* --- Map over the array --- */}
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
