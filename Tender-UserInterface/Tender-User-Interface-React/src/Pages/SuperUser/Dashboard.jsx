import React, { useState } from 'react';
import './Dashboard.css';
import SuperUserNavBar from '../../Components/SuperUserNavBar/SuperUserNavBar';

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

    // chekc which scraper should be displayed
    const [selectedScraper, setSelectedScraper] = useState(scraperSources[0]);

    // get logs - empty array if nothing selected
    const currentLogs = placeholderLogs[selectedScraper] || [];

    // update state when dropdown changes
    const handleScraperChange = (event) => {
        setSelectedScraper(event.target.value);
        // fetchScraperLogs(event.target.value); 
    };

    return (
        <div className="dashboard-container">
            <SuperUserNavBar />

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
                        <p>Active Users: 1233</p>
                        <p>New Users (last 7 days): 15</p>
                        <div className="dashboard-actions">
                            <button className="manage-btn">Manage Users</button>
                            <button className="add-btn">Add +</button>
                        </div>
                    </section>

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

                {/* recent activity */}
                <section className="dashboard-card recent-activity">
                    <div className="card-header">
                        <h2>Recent Activity</h2>
                    </div>
                    <ul className="activity-list">
                        <li>14:30: Scraper task executed successfully.</li>
                        <li>14:15: <span className="critical">CRITICAL:</span> Unhandled exception in Tender API</li>
                        <li>14:00: New user registered</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
