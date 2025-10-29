import React, { useState, useEffect } from "react";
import { FaChartLine, FaMapMarkerAlt, FaRegClock, FaExclamationTriangle, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./Analytics.css";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import axios from 'axios';
import { fetchUserAttributes } from '@aws-amplify/auth';
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

    const CollapsibleSection = ({ title, subtitle, children, defaultOpen = true }) => {
        // each section manages its own open/closed state
        const [isOpen, setIsOpen] = useState(defaultOpen);

        return (

            <div className="analytics-section">
                {/* Clickable Header */}
                <div
                    className="section-header" 
                    onClick={() => setIsOpen(!isOpen)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} // Basic inline styles
                    role="button"
                    aria-expanded={isOpen}>
                    {/* Title and Subtitle */}
                    <div>
                        <h2 className="section-title">{title}</h2>
                        {subtitle && <p className="section-subtitle">{subtitle}</p>}
                    </div>
                    {/* Arrow Icon */}
                    <span className="collapse-icon">
                        {isOpen ? <FaChevronDown /> : <FaChevronRight />}
                    </span>
                </div>

                <div className={`section-content ${isOpen ? 'open' : ''}`}>
                    <div className="content-inner-wrapper">
                        {children}
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {

        const fetchAnalytics = async () => {
            setLoading(true);
            let coreId = null;

            try {

                if (user) {
                    try {

                        const attributes = await fetchUserAttributes();
                        coreId = attributes['custom:CoreID']; 
                        if (!coreId) {
                            console.log("CoreID not found for logged-in user. Fetching public analytics.");
                        }
                    } catch (attrError) {
                        console.error("Error fetching user attributes:", attrError);
                    }
                }

                // all users have this base endpoint
                const endpoint = `https://vaon5sbbdk.execute-api.us-east-1.amazonaws.com/analytics`;

                const headers = {
                    'Content-Type': 'application/json',
                };

                if (coreId) {
                    headers['X-User-ID'] = coreId;
                }

                // request with the endpoint and headers
                const response = await fetch(endpoint, {
                    headers: headers,
                });

                if (!response.ok) {
                    throw new Error(`HTTP Error! status: ${response.status}`);
                }

                const data = await response.json();

                setAnalytics(data);
            } catch (err) {

                setError(err.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [user]);

    if (loading) {
        return (
            <div className="loading-overlay">
                <LoadingSpinner text="Compiling your tender analytics..." />
            </div>
        );
    }

    // error check: runs if loading is false + error message exists
    if (error) {
        return (
            <div className="analytics-container">
                <div className="analytics-state-wrapper">
                    <div className="error-state-message">
                        <span className="error-state-icon">
                            <FaExclamationTriangle />
                        </span>
                        <h2>Analytics Unavailable</h2>
                        <p>We couldn't load your tender analytics right now. Please try again later.</p>
                    </div>
                </div>
            </div>
        );
    }

    // no data check: runs if loading is false + no error + the data is missing / empty
    if (!analytics || analytics.totalTenders === 0) {
        return (
            <div className="analytics-container">
                <div className="analytics-state-wrapper">
                    <div className="empty-state-message">
                        <span className="error-state-icon">
                            <FaChartLine />
                        </span>
                        <h2>No Data Available</h2>
                        <p>There is no tender analytics data to display yet. Start tracking tenders to see your insights here!</p>
                    </div>
                </div>
            </div>
        );
    }

    const {
        totalTenders,
        openTenders,
        closedTenders,
        openRatio,
        statusBreakdown,
        tendersBySource,
        tendersByProvince,
        standardUserAnalytics, // this will be undefined for guests/admins
        superUserAnalytics   // this will be undefined for guests/standard users
    } = analytics;

    const mostActiveProvince =
        tendersByProvince?.length > 0
            ? [...tendersByProvince].sort((a, b) => b.value - a.value)[0].name
            : "N/A";

    const COLORS = ["#81C784", "#CD4F6E"];
    const SOURCE_COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];

    return (
        <div className="analytics-container">
            {/* Page Header */}
            <div className="tracking-header">
                <h1 className="tracking-title">{user ? `${user.username.split('@')[0]}'s Analytics` : "Analytics"}</h1>
                <p className="tracking-subtitle">
                    {user
                        ? "Insights tailored to your tender activity"
                        : "Visual insights and statistics based on live tender data"}
                </p>
            </div>

            {/* Quick Info Section */}
            <CollapsibleSection
                title="Quick Insights"
                subtitle="A glance at your most important tender stats">
                <div className="info-cards">
                    <div className="info-card">
                        <span className="info-icon"><FaChartLine /></span>
                        <p>
                            {user ? (
                                standardUserAnalytics ? (
                                    // Standard User View
                                    <>You are tracking <strong>{standardUserAnalytics.openUserTenders}</strong> open tenders out of <strong>{standardUserAnalytics.totalUserTenders}</strong> total.</>
                                ) : (
                                    // Super User View (or user w/o personal stats)
                                    <>You currently have <strong>{openTenders}</strong> open tenders out of <strong>{totalTenders}</strong> total.</>
                                )
                            ) : (
                                // Guest View
                                <>There are currently <strong>{openTenders}</strong> open tenders out of <strong>{totalTenders}</strong> tenders tracked.</>
                            )}
                        </p>
                    </div>
                    <div className="info-card">
                        <span className="info-icon"><FaMapMarkerAlt /></span>
                        <p>
                            {/* NOTE: This stat is not personalized because 'standardUserAnalytics'
                          doesn't provide a personal 'mostActiveProvince'. 
                        */}
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
                                standardUserAnalytics ? (
                                    // Standard User View
                                    <><strong>{standardUserAnalytics.userOpenRatio}%</strong> of your tracked tenders remain open.</>
                                ) : (
                                    // Super User View
                                    <>Overall, <strong>{openRatio}%</strong> of tenders remain open.</>
                                )
                            ) : (
                                // Guest View
                                <>Currently, <strong>{openRatio}%</strong> of tenders are open.</>
                            )}
                        </p>
                    </div>
                </div>
        </CollapsibleSection>
                    
            {/* this block will only render if 'standardUserAnalytics' exists */}
            {standardUserAnalytics && (
                <CollapsibleSection
                    title="Your Personal Activity"
                    subtitle="Stats based on the tenders you are personally tracking">
                    <div className="analytics-summary">
                        <div className="summary-card">
                            <h3>Your Tenders</h3>
                            <p>{standardUserAnalytics.totalUserTenders}</p>
                            <small>Total tenders you are tracking</small>
                        </div>
                        <div className="summary-card">
                            <h3>Your Open Tenders</h3>
                            <p>{standardUserAnalytics.openUserTenders}</p>
                            <small>Your tracked tenders that are open</small>
                        </div>
                        <div className="summary-card">
                            <h3>Your Open Ratio</h3>
                            <p>{standardUserAnalytics.userOpenRatio}%</p>
                            <small>Percentage of your tenders that are open</small>
                        </div>
                        <div className="summary-card">
                            <h3>Closing Soon</h3>
                            <p>{standardUserAnalytics.closingSoon}</p>
                            <small>Your tracked tenders closing soon</small>
                        </div>
                    </div>
                </CollapsibleSection>
            )}

            {/* this block will only render if 'superUserAnalytics' exists */}
            {superUserAnalytics && (
                <CollapsibleSection
                    title="Admin Overview"
                    subtitle="Platform-wide user statistics">
                    <div className="analytics-summary">
                        <div className="summary-card">
                            <h3>Total Users</h3>
                            <p>{superUserAnalytics.totalUsers}</p>
                            <small>All registered users</small>
                        </div>
                        <div className="summary-card">
                            <h3>Standard Users</h3>
                            <p>{superUserAnalytics.standardUsers}</p>
                            <small>Standard user accounts</small>
                        </div>
                        <div className="summary-card">
                            <h3>Admin Users</h3>
                            <p>{superUserAnalytics.superUsers}</p>
                            <small>Users with admin privileges</small>
                        </div>
                        <div className="summary-card">
                            <h3>New This Month</h3>
                            <p>{superUserAnalytics.newRegistrationsThisMonth}</p>
                            <small>New users this month</small>
                        </div>
                    </div>
                </CollapsibleSection>
            )}

            {/* Summary Cards Section */}
            <CollapsibleSection
                title="Platform Stats"
                subtitle="Overall statistics for the tender tool">
                <div className="analytics-summary">
                    <div className="summary-card">
                        <h3>Total Tenders</h3>
                        <p>{totalTenders}</p>
                        <small>Total tenders on tender tool</small>
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
            </CollapsibleSection>

            {/* Charts Section */}
            <CollapsibleSection
                title="Analytics Charts"
                subtitle="Visual breakdowns for better decision making">
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

                    {tendersBySource && tendersBySource.length > 0 && (
                        <div className="chart-section">
                            <h3>Tenders by Source</h3>
                            <p className="chart-subtitle">Shows the proportion of tenders from each source</p>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie data={tendersBySource} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                        {tendersBySource.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={SOURCE_COLORS[index % SOURCE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}

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
            </CollapsibleSection>
        </div>
    );
};

export default Analytics;
