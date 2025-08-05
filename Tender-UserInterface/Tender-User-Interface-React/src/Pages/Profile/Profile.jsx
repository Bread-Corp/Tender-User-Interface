import React, { useState, useEffect } from "react";
import "./Profile.css";
import { FaUserCircle } from "react-icons/fa";

const Profile = () => {

    //Declares the dark mode constant with a method to change it.
    //Checks localstorage for previous stores.
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

    // Keep track of which field is currently being edited
    const [editingField, setEditingField] = useState(null);

    //triggered on initialisation and whenever the constant darkMode is changed.
    //toggles the attribute on the body class and saves new setting to localStorage.
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
        setEditingField(null);
    };

    const handleCancel = () => {
        setFormData({ ...initialFormData });
        setProfileImage(null);
        setHasChanges(false);
        setEditingField(null);
    };

    return (
        <div className="layout-wrapper">
            <div className="profile-container">
                <section className="profile-section profile-card">
                    <div className="card">
                        <h2>Profile</h2>
                        <div className="avatar-wrapper">
                            {profileImage ? (
                                <img src={profileImage} alt="profile" className="avatar-img" />
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
                            {["name", "email", "phone"].map((field) => (
                                <div className="info-row" key={field}>
                                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                    <input
                                        name={field}
                                        type={field === "email" ? "email" : "text"}
                                        value={formData[field]}
                                        onChange={handleInputChange}
                                        readOnly={editingField !== field}
                                    />
                                    {editingField !== field ? (
                                        <button
                                            className="info-edit-btn"
                                            onClick={() => setEditingField(field)}
                                        >
                                            Edit
                                        </button>
                                    ) : (
                                        <span className="editing-label">Editing</span>
                                    )}
                                </div>
                            ))}
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
            </div>
        </div>
    );
};

export default Profile;
