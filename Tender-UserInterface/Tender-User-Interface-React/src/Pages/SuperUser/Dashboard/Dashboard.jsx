import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import AddSuperUser from '../../../Components/AddSuperUser/AddSuperUser';
import { fetchUserAttributes } from '@aws-amplify/auth';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import { FaExclamationTriangle, FaDownload } from 'react-icons/fa';
import axios from 'axios';

const categories = ["scrapers", "pipeline"]
const scraperSources = ["eTenderLambda", "EskomLambda", "TransnetLambda", "SanralLambda", "SarsLambda"];
const pipelineSources = ["DeduplicationLambda", "AISummaryLambda", "AITaggingLambda", "DBWriterLambda", "TenderCleanupLambda"]

//required url
const apiLogURL = import.meta.env.VITE_LOG_API;

// mock data
const placeholderLogs = {
    "Etenders": ["10:00: Fetched 50 tenders (Success).", "09:55: Connection re-established."],
    "Eskom": ["11:30: Fetched 20 tenders (Success).", "11:20: Warning: Missing closing date on TDR-112."],
    "SANRAL": ["12:00: Scraper finished (Success)."],
    "SARS": ["13:00: API Rate Limit Hit (Failure).", "12:50: Retrying connection..."],
    "Transnet": ["14:00: Fetched 15 tenders (Success)."]
};

const Dashboard = () => {
    //states for log info
    const [fileName, setFileName] = useState(null);
    const [URL, setURL] = useState(null);
    const [lastScrap, setLastScrap] = useState("Unknown");

    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [availableSources, setAvailableSources] = useState(scraperSources);
    const [selectedSource, setSelectedSource] = useState(scraperSources[0]);

    const [isLogLoading, setIsLogLoading] = useState(false);
    const [totalUsers, setTotalUsers] = useState(0);
    const [userLoading, setUserLoading] = useState(true);
    const [userError, setUserError] = useState(null);
    const navigate = useNavigate();
    const apiURL = import.meta.env.VITE_API_URL;

    const handleCategoryChange = (event) => {
        const newCategory = event.target.value;
        setSelectedCategory(newCategory);

        // Clear old logs
        setFileName(null);
        setURL(null);
        setIsLogLoading(false);
    };

    // update state when dropdown changes
    const handleSourceChange = (event) => {
        const newSource = event.target.value;

        // clear the old log link immediately
        setFileName(null);
        setURL(null);
        setIsLogLoading(true);

        // set the new scraper and fetch its logs
        setSelectedSource(newSource);
        fetchScraperLogs(selectedCategory, newSource); 
    };

    //add super user modal state
    const [showAddUser, setShowAddUser] = useState(false);

    const handleOpen = () => setShowAddUser(true);

    const handleClose = () => setShowAddUser(false);

    const handleSubmit = (data) => {
        console.log('Submitted:', data);
        setShowAddUser(false);
    };

    useEffect(() => {
        if (selectedCategory === 'scrapers') {
            setAvailableSources(scraperSources);
            setSelectedSource(scraperSources[0]); // Set default source
        } else if (selectedCategory === 'pipeline') {
            setAvailableSources(pipelineSources);
            setSelectedSource(pipelineSources[0]); // Set default source
        }
    }, [selectedCategory]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setUserLoading(true);
                setUserError(null);

                const attributes = await fetchUserAttributes();
                const currentAdminID = attributes['custom:CoreID'];

                if (!currentAdminID) {
                    throw new Error("Admin CoreID not found. You may not have permission.");
                }

                const response = await fetch(`${apiURL}/TenderUser/fetch/${currentAdminID}`);

                if (!response.ok) {
                    const errorData = await response.json();
                    if (errorData.message === 'Invalid User') {
                        throw new Error("You do not have permission to view this data.");
                    }
                    throw new Error(errorData.message || 'Failed to fetch users');
                }

                const data = await response.json();
                const allUsers = data.allUsers || [];

                setTotalUsers(allUsers.length);

            } catch (err) {
                if (err.name === 'NotAuthorizedException') {
                    navigate('/login');
                }
                setUserError(err.message);
                console.error('Error fetching users:', err);
            } finally {
                setUserLoading(false);
            }
        };

        fetchUsers();
    }, [navigate, apiURL]);

    if (userLoading) {
        return (
            <div className="loading-overlay">
                <LoadingSpinner text="Loading dashboard data..." />
            </div>
        );
    }

    if (userError) {
        return (

            <div className="dashboard-container">
                <div className="analytics-state-wrapper">
                    <div className="error-state-message">
                        <span className="error-state-icon">
                            <FaExclamationTriangle />
                        </span>
                        <h2>Error Loading Dashboard</h2>
                        <p>{userError}</p>
                    </div>
                </div>
            </div>
        );
    }

    const fetchScraperLogs = async (categoryToFetch, sourceToFetch) => {
        let coreID = null;

        try {

            const attributes = await fetchUserAttributes();
            coreID = attributes["custom:CoreID"];
        } catch (attrError) {
            console.error("Error fetching user attributes:", attrError);
        }

        try {
            const logBody = {
                category: categoryToFetch,
                functionName: sourceToFetch,
                userId: coreID,
            };
            console.log('logBody:', logBody);

            const response = await axios.post(`${apiLogURL}`, logBody, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const { fileName, downloadUrl } = response.data;

            console.log('Logs fetched at :', Date.now());

            setFileName(fileName);
            setURL(downloadUrl);
            setLastScrap(new Date().toLocaleString() + ' SAST');
            return;
        }
        catch (error) {
            console.error('Internal error fetching logs: ', error);
        } finally {
            setIsLogLoading(false); 
        }
    }

        return (
            <div className="dashboard-container">

                <div className="dashboard-banner">
                    <h1>Welcome Super User</h1>
                    <p>You have full administrative access.</p>
                </div>

                <div className="dashboard-sections">
                    <div className="dashboard-row">
                        {/* User Management */}
                        <section className="dashboard-card user-management">
                            <div className="card-header">
                                <h2>User Management</h2>
                            </div>
                            <p>New Users (last 7 days): {totalUsers}</p>
                            <div className="dashboard-actions">
                                <Link to="/superuser/manageusers" className="manage-btn">
                                    Manage Users
                                </Link>
                                <button className="add-btn" onClick={handleOpen}>Add +</button>
                            </div>
                        </section>

                        {/* Modal Popup */}
                        {showAddUser && (
                            <div className="modal-overlay">
                                    <AddSuperUser onSubmit={handleSubmit} onCancel={handleClose} />
                            </div>
                        )}

                        {/* System Health */}
                        <section className="dashboard-card system-health">
                            <div className="card-header">
                                <h2>System Health</h2>
                            </div>
                            <div className="dashboard-actions">

                                <select
                                    className="scraper-select"
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    className="scraper-select"
                                    value={selectedSource}
                                    onChange={handleSourceChange}>
                                    {availableSources.map(source => (
                                        <option key={source} value={source}>
                                            {source} Logs
                                        </option>
                                    ))}
                                </select>
                                                               
                            </div>
                        </section>
                    </div>

                    {/* scraper logs display section */}
                    <section className="dashboard-card scraper-logs-display">
                        <div className="card-header">
                            <h2>Logs: {selectedSource}</h2>
                        </div>

                        {!isLogLoading && fileName && URL && (
                            <div className="dashboard-actions">
                                <a className="download-link" href={URL} target="_blank" rel="noopener noreferrer">
                                    <FaDownload style={{ marginRight: '8px' }} />
                                     View Full Log: {fileName}
                                </a>
                            </div>
                        )}

                        {/* Show loading text */}
                        {isLogLoading && (
                            <div className="dashboard-actions">
                                <p>Fetching logs for {selectedSource}...</p>
                            </div>
                        )}

                        {/* Show placeholder text if not loading AND no file exists */}
                        {!isLogLoading && !fileName && (
                            <p>Select a source to fetch its logs.</p>
                        )}

                    </section>
                                       
                </div>
            </div>
        );
    };

    export default Dashboard;
