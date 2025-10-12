import React, { useState } from "react";
import { FaChartLine, FaMapMarkerAlt, FaRegClock } from "react-icons/fa";
import "./Analytics.css";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

// Mock tender data
const initialTenders = [
    { id: 1, title: "Bulk Laptops", location: "Eastern Cape", closing: "06/06/2025", status: "Open" },
    { id: 2, title: "Vehicle Maintenance", location: "KwaZulu-Natal", closing: "11/06/2025", status: "Closed" },
    { id: 3, title: "Solar Street Lights", location: "Gauteng", closing: "20/06/2025", status: "Open" },
    { id: 4, title: "Catering Services", location: "Western Cape", closing: "28/06/2025", status: "Closed" },
    { id: 5, title: "Stationery Supply", location: "Gauteng", closing: "30/06/2025", status: "Open" },
];

const Analytics = () => {
    const [tenders] = useState(initialTenders);

    // Summary counts
    const totalTenders = tenders.length;
    const openCount = tenders.filter((t) => t.status === "Open").length;
    const closedCount = tenders.filter((t) => t.status === "Closed").length;
    const openPercentage = ((openCount / totalTenders) * 100).toFixed(1);

    // Data for charts
    const statusData = [
        { name: "Open", value: openCount },
        { name: "Closed", value: closedCount },
    ];

    const locationCounts = tenders.reduce((acc, t) => {
        acc[t.location] = (acc[t.location] || 0) + 1;
        return acc;
    }, {});
    const locationData = Object.entries(locationCounts).map(([name, value]) => ({ name, value }));

    const COLORS = ["#81C784", "#CD4F6E"];

    return (
        <div className="analytics-container">

            {/* Page Header */}
            <div className="tracking-header">
                <h1 className="tracking-title">Analytics</h1>
                <p className="tracking-subtitle">
                    Visual insights and statistics based on your tender activity
                </p>
            </div>

            {/* Quick Info Section */}
            <div className="analytics-section">
                <h2 className="section-title">Quick Insights</h2>
                <p className="section-subtitle">A glance at your most important tender stats</p>
                <div className="info-cards">
                    <div className="info-card">
                        <span className="info-icon"><FaChartLine /></span>
                        <p>You currently have <strong>{openCount}</strong> open tenders out of <strong>{totalTenders}</strong> total.</p>
                    </div>
                    <div className="info-card">
                        <span className="info-icon"><FaMapMarkerAlt /></span>
                        <p>Your most active province is <strong>{Object.entries(locationCounts).sort((a, b) => b[1] - a[1])[0][0]}</strong>.</p>
                    </div>
                    <div className="info-card">
                        <span className="info-icon"><FaRegClock /></span>
                        <p>Overall, <strong>{openPercentage}%</strong> of your tenders remain open.</p>
                    </div>
                </div>
            </div>

            {/* Summary Cards Section */}
            <div className="analytics-section">
                <h2 className="section-title">Tender Summary</h2>
                <p className="section-subtitle">Detailed numbers to help you track tender activity</p>
                <div className="analytics-summary">
                    <div className="summary-card">
                        <h3>Total Tenders</h3>
                        <p>{totalTenders}</p>
                        <small>Total tenders currently being tracked</small>
                    </div>
                    <div className="summary-card">
                        <h3>Open</h3>
                        <p>{openCount}</p>
                        <small>Tenders still accepting bids</small>
                    </div>
                    <div className="summary-card">
                        <h3>Closed</h3>
                        <p>{closedCount}</p>
                        <small>Tenders that have ended</small>
                    </div>
                    <div className="summary-card">
                        <h3>Open Ratio</h3>
                        <p>{openPercentage}%</p>
                        <small>Percentage of tenders that remain open</small>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="analytics-section">
                <h2 className="section-title">Tender Analytics</h2>
                <p className="section-subtitle">Visual breakdowns for better decision making</p>
                <div className="charts-grid">

                    {/* Pie Chart */}
                    <div className="chart-section">
                        <h3>Status Breakdown</h3>
                        <p className="chart-subtitle">Shows the proportion of open vs closed tenders</p>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Bar Chart */}
                    <div className="chart-section">
                        <h3>Tenders by Province</h3>
                        <p className="chart-subtitle">Number of tenders in each province</p>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={locationData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#5571A6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default Analytics;
