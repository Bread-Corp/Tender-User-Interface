import React, { useState, useEffect } from "react";
import "./Profile.css";
import { FaPen, FaUserCircle, FaMoon, FaSun } from "react-icons/fa";

const Profile = () => {
    const [darkMode, setDarkMode] = useState(() => {
        const storedMode = localStorage.getItem("darkMode");
        return storedMode === "true";
    });

    const [profileImage, setProfileImage] = useState(null);
    const [formData, setFormData] = useState({
        name: "John Doe",
        email: "JohnDoe@gmail.com",
        phone: "123 456 789",
    });

    useEffect(() => {
        document.body.classList.toggle("dark-mode", darkMode);
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode(prev => !prev);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="profile-container">
            {/* Left Section - Edit Profile */}
            <section className="profile-section">
                <h2>Edit Profile</h2>
                <div className="card">
                    <div className="avatar-wrapper">
                        {profileImage ? (
                            <img src={profileImage} alt="Profile" className="avatar-img" />
                        ) : (
                            <FaUserCircle className="avatar-icon" />
                        )}
                        <input
                            type="file"
                            id="upload"
                            accept="image/*"
                            onChange={handleImageUpload}
                            hidden
                        />
                        <label htmlFor="upload" className="upload-text">Upload Image</label>
                    </div>

                    <div className="info-group">
                        <div className="info-row">
                            <label>Name</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="info-row">
                            <label>Email</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="info-row">
                            <label>Phone</label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Right Section - Settings */}
            <section className="profile-section">
                <h2>Profile Settings</h2>
                <div className="card">
                    <div className="setting-row">
                        <label>Categories</label>
                        <button className="view-btn">View</button>
                    </div>
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
                    <div className="setting-row">
                        <label>Theme</label>
                        <button className="dark-toggle" onClick={toggleDarkMode}>
                            {darkMode ? <FaSun /> : <FaMoon />}
                            {darkMode ? " Light Mode" : " Dark Mode"}
                        </button>
                    </div>
                    <div className="setting-row delete-row">
                        <label>Delete Account</label>
                        <button className="delete-btn">Delete</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Profile;
