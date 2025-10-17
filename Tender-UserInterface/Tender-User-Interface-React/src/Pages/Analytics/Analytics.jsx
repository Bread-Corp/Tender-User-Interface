import React, { useState, useEffect } from "react";
import { FaChartLine, FaMapMarkerAlt, FaRegClock } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
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

const Analytics = () => {
    const { user } = useAuth(); // current logged-in user
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                // fallback to general endpoint
                const endpoint = user?.coreId
                    ? `https://vaon5sbbdk.execute-api.us-east-1.amazonaws.com/analytics/user/${userId}` //doesnt work - placeholder
                    : `https://vaon5sbbdk.execute-api.us-east-1.amazonaws.com/analytics`;

                const response = await fetch(endpoint, {
                    headers: user?.token
                        ? { Authorization: `Bearer ${user.token}` }
                        : {},
                });

                if (!response.ok) {
                    throw new Error(`HTTP Error! status: ${response.status}`);
                }

                const data = await response.json();
                setAnalytics(data);
            } catch (err) {
                console.error("Error fetching analytics:", err);
                setError(err.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [user]);

    if (loading) return <div>Loading analytics...</div>;
    if (error) return <div>Error loading analytics: {error}</div>;
    if (!analytics) return <div>No analytics data available.</div>;

    const { totalTenders, openTenders, closedTenders, openRatio, statusBreakdown, tendersByProvince } = analytics;

    const mostActiveProvince =
        tendersByProvince?.length > 0
            ? [...tendersByProvince].sort((a, b) => b.value - a.value)[0].name
            : "N/A";

    const COLORS = ["#81C784", "#CD4F6E"];

    return (
        <div className="analytics-container">
            {/* Page Header */}
            <div className="tracking-header">
                <h1 className="tracking-title">{user ? `${user.name}'s Analytics` : "Analytics"}</h1>
                <p className="tracking-subtitle">
                    {user
                        ? "Insights tailored to your tender activity"
                        : "Visual insights and statistics based on live tender data"}
                </p>
            </div>

            {/* Quick Info Section */}
            <div className="analytics-section">
                <h2 className="section-title">Quick Insights</h2>
                <p className="section-subtitle">A glance at your most important tender stats</p>
                <div className="info-cards">
                    <div className="info-card">
                        <span className="info-icon"><FaChartLine /></span>
                        <p>
                            {user ? (
                                <>You currently have <strong>{openTenders}</strong> open tenders out of <strong>{totalTenders}</strong> total.</>
                            ) : (
                                <>There are currently <strong>{openTenders}</strong> open tenders out of <strong>{totalTenders}</strong> tenders tracked.</>
                            )}
                        </p>
                    </div>
                    <div className="info-card">
                        <span className="info-icon"><FaMapMarkerAlt /></span>
                        <p>
                            {user ? (
                                <>Your most active province is <strong>{mostActiveProvince}</strong>.</>
                            ) : (
                                <>The province with the most tenders is <strong>{mostActiveProvince}</strong>.</>
                            )}
                        </p>
                    </div>
                    <div className="info-card">
                        <span className="info-icon"><FaRegClock /></span>
                        <p>
                            {user ? (
                                <>Overall, <strong>{openRatio}%</strong> of tenders remain open.</>
                            ) : (
                                <>Currently, <strong>{openRatio}%</strong> of tenders are open.</>
                            )}
                        </p>
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
                        <p>{openTenders}</p>
                        <small>Tenders still accepting bids</small>
                    </div>
                    <div className="summary-card">
                        <h3>Closed</h3>
                        <p>{closedTenders}</p>
                        <small>Tenders that have ended</small>
                    </div>
                    <div className="summary-card">
                        <h3>Open Ratio</h3>
                        <p>{openRatio}%</p>
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
                                    data={statusBreakdown}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label>
                                    {statusBreakdown.map((entry, index) => (
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
                            <BarChart data={tendersByProvince}>
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
