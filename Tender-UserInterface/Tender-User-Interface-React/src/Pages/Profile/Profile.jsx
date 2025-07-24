import React, { useState, useEffect } from "react";
import "./Profile.css";
import { FaPen, FaUserCircle, FaMoon, FaSun } from "react-icons/fa";

const Profile = () => {
    const [darkMode, setDarkMode] = useState(() => {
        const storedMode = localStorage.getItem("darkMode");
        return storedMode === "true";
    });

    const [profileImage, setProfileImage] = useState(null);
    const [initialFormData, setInitialFormData] = useState({
        name: "John Doe",
        email: "JohnDoe@gmail.com",
        phone: "123 456 789",
    });

    const [formData, setFormData] = useState({ ...initialFormData });
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        document.body.classList.toggle("dark-mode", darkMode);
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasChanges) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [hasChanges]);

    const toggleDarkMode = () => setDarkMode(prev => !prev);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedForm = { ...formData, [name]: value };
        setFormData(updatedForm);
        setHasChanges(JSON.stringify(updatedForm) !== JSON.stringify(initialFormData));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
                setHasChanges(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        setInitialFormData({ ...formData });
        setHasChanges(false);
        // backend update logic could go here (?)
    };

    const handleCancel = () => {
        setFormData({ ...initialFormData });
        setProfileImage(null);
        setHasChanges(false);
    };

    return (
        <div className="layout-wrapper">
            <div className="profile-container">
                {/* left section - smaller profile card */}
                <section className="profile-section profile-card">
                    <h2>Profile</h2>
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

                        <div className="button-group">
                            <button
                                className="save-btn"
                                onClick={handleSave}
                                disabled={!hasChanges}
                            >
                                Save
                            </button>
                            <button
                                className="cancel-btn"
                                onClick={handleCancel}
                                disabled={!hasChanges}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </section>

                {/* right section - bigger settings card */}
                <section className="profile-section settings-card">
                    <h2>Settings</h2>
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
                            <button className={`dark-toggle ${darkMode ? "light" : "dark"}`} onClick={toggleDarkMode}>
                                {darkMode ? <FaMoon /> : <FaSun />}
                                <span className="mode-text">{darkMode ? "Dark Mode" : "Light Mode"}</span>
                            </button>
                        </div>
                        <div className="setting-row delete-row">
                            <label>Delete Account</label>
                            <button className="delete-btn">Delete</button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Profile;
