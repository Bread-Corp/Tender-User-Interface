import React, { useState, useEffect } from "react";
import "./Settings.css";
import { FaMoon, FaSun } from "react-icons/fa";

const Settings = () => {
    // get dark mode preference from local storage or false as default
    const [darkMode, setDarkMode] = useState(() => {
        const storedMode = localStorage.getItem("darkMode");
        return storedMode === "true";
    });

    // flag to check if user is logged in (for testing)
    const isLoggedIn = Boolean(localStorage.getItem("authToken"));

    // toggle dark mode class on body and save preference
    useEffect(() => {
        document.body.classList.toggle("dark-mode", darkMode);
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    // handler to toggle dark mode state
    const toggleDarkMode = () => setDarkMode(prev => !prev);

    return (
        <div className="layout-wrapper">
            <div className="settings-container">
                <section className="settings-section settings-card">
                    <h2>Settings</h2>
                    <div className="settings-card">

                        {/* general settings */}
                        <div className="setting-row">
                            <label>Language</label>
                            <select className="settings-dropdown">
                                <option>English</option>
                                <option>Afrikaans</option>
                                <option>Zulu</option>
                            </select>
                        </div>

                        <div className="setting-row">
                            <label>Date Format</label>
                            <select className="settings-dropdown">
                                <option value="dd/mm/yyyy">dd/mm/yyyy</option>
                                <option value="mm/dd/yyyy">mm/dd/yyyy</option>
                                <option value="yyyy-mm-dd">yyyy-mm-dd</option>
                            </select>
                        </div>

                        <div className="setting-row">
                            <label>Time Zone</label>
                            <select className="settings-dropdown">
                                <option>GMT +2 (South Africa)</option>
                                <option>GMT</option>
                                <option>UTC</option>
                            </select>
                        </div>

                        <div className="setting-row">
                            <label>Default View</label>
                            <select className="settings-dropdown">
                                <option>Dashboard</option>
                                <option>Discovery</option>
                                <option>Tracking</option>
                            </select>
                        </div>

                        {/* logged in users - not functional rn */}
                        {isLoggedIn && (
                            <>
                                <div className="setting-row">
                                    <label>Change Password</label>
                                    <button className="view-btn">Update</button>
                                </div>

                                <div className="setting-row">
                                    <label>Notifications</label>
                                    <div className="toggle-group">
                                        <label><input type="checkbox" /> Email</label>
                                        <label><input type="checkbox" /> SMS</label>
                                    </div>
                                </div>

                                <div className="setting-row delete-row">
                                    <label>Delete Account</label>
                                    <button className="delete-btn">Delete</button>
                                </div>
                            </>
                        )}

                        {/* theme settings - doesnt apply correctly yet */}
                        <div className="setting-row">
                            <label>Theme</label>
                            <button
                                className={`dark-toggle ${darkMode ? "light" : "dark"}`}
                                onClick={toggleDarkMode}
                            >
                                {darkMode ? <FaMoon /> : <FaSun />}
                                <span className="mode-text">
                                    {darkMode ? "Dark Mode" : "Light Mode"}
                                </span>
                            </button>
                        </div>

                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;
