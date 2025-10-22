import React from 'react';
import './Dashboard.css';
import SuperUserNavBar from '../../Components/SuperUserNavBar/SuperUserNavBar';

const Dashboard = () => {
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
                    <section className="dashboard-card-user-management">
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
                                <button className="scraper-btn">View Scraper Logs</button>
                            </div>
                        </section>
                </div>

                {/* Recent Activity */}
                <section className="dashboard-card recent-activity">
                    <div className="card-header">
                        <h2>Recent Activity</h2>
                    </div>
                    <ul>
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
