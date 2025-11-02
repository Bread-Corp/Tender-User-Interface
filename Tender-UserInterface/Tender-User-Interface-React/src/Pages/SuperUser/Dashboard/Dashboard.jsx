import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import AddSuperUser from '../../../Components/AddSuperUser/AddSuperUser';
import { fetchUserAttributes } from '@aws-amplify/auth';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import { FaExclamationTriangle } from 'react-icons/fa';

const scraperSources = ["Etenders", "Eskom", "SANRAL", "SARS", "Transnet"];

// mock data
const placeholderLogs = {
    "Etenders": ["10:00: Fetched 50 tenders (Success).", "09:55: Connection re-established."],
    "Eskom": ["11:30: Fetched 20 tenders (Success).", "11:20: Warning: Missing closing date on TDR-112."],
    "SANRAL": ["12:00: Scraper finished (Success)."],
    "SARS": ["13:00: API Rate Limit Hit (Failure).", "12:50: Retrying connection..."],
    "Transnet": ["14:00: Fetched 15 tenders (Success)."]
};

const Dashboard = () => {

    const [totalUsers, setTotalUsers] = useState(0);
    const [userLoading, setUserLoading] = useState(true);
    const [userError, setUserError] = useState(null);
    const navigate = useNavigate();
    const apiURL = import.meta.env.VITE_API_URL;

    // chekc which scraper should be displayed
    const [selectedScraper, setSelectedScraper] = useState(scraperSources[0]);

    // get logs - empty array if nothing selected
    const currentLogs = placeholderLogs[selectedScraper] || [];

    // update state when dropdown changes
    const handleScraperChange = (event) => {
        setSelectedScraper(event.target.value);
        // fetchScraperLogs(event.target.value);
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
                            <p>Last successful scrap: 2025-07-26 SAST</p>
                            <p>Error Count (24h): 3</p>
                            <div className="dashboard-actions">

                                <select
                                    className="scraper-select"
                                    value={selectedScraper}
                                    onChange={handleScraperChange}>
                                    {scraperSources.map(source => (
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
                            <h2>Logs: {selectedScraper}</h2>
                        </div>
                        {currentLogs.length > 0 ? (
                            <ul className="activity-list">
                                {currentLogs.map((log, index) => (
                                    <li key={index} className={log.includes("Failure") || log.includes("Error") || log.includes("CRITICAL") ? "critical" : ""}>
                                        {log}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No recent logs found for {selectedScraper}.</p>
                        )}
                    </section>
                                       
                </div>
            </div>
        );
    };

    export default Dashboard;
