import React, { useState, useEffect } from "react";
import "./Profile.css";
import { FaUserCircle } from "react-icons/fa";

const Profile = () => {
    // state for profile image preview
    const [profileImage, setProfileImage] = useState(null);

    // initial form data for profile info
    const [initialFormData, setInitialFormData] = useState({
        name: "John Doe",
        email: "JohnDoe@gmail.com",
        phone: "123 456 789",
    });

    // form data that can be edited
    const [formData, setFormData] = useState({ ...initialFormData });

    // flag to track if form has unsaved changes
    const [hasChanges, setHasChanges] = useState(false);

    // warn user if they try to leave page with unsaved changes
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

    // update form data and track changes when input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedForm = { ...formData, [name]: value };
        setFormData(updatedForm);
        setHasChanges(JSON.stringify(updatedForm) !== JSON.stringify(initialFormData));
    };

    // read and preview uploaded profile image, mark changes
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

    // save changes and reset change flag
    const handleSave = () => {
        setInitialFormData({ ...formData });
        setHasChanges(false);
    };

    // cancel edits and reset form and image preview
    const handleCancel = () => {
        setFormData({ ...initialFormData });
        setProfileImage(null);
        setHasChanges(false);
    };

    return (
        <div className="layout-wrapper">
            <div className="profile-container">
                <section className="profile-section profile-card">
                    <h2>profile</h2>
                    <div className="card">
                        <div className="avatar-wrapper">
                            {/* show image preview or default icon */}
                            {profileImage ? (
                                <img src={profileImage} alt="profile" className="avatar-img" />
                            ) : (
                                <FaUserCircle className="avatar-icon" />
                            )}
                            {/* hidden file input for image upload */}
                            <input
                                type="file"
                                id="upload"
                                accept="image/*"
                                onChange={handleImageUpload}
                                hidden
                            />
                            <label htmlFor="upload" className="upload-text">upload image</label>
                        </div>

                        {/* input fields for user info */}
                        <div className="info-group">
                            <div className="info-row">
                                <label>Name</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                                <button className="info-edit-btn">Edit</button>
                            </div>
                            <div className="info-row">
                                <label>Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                                <button className="info-edit-btn">Edit</button>
                            </div>
                            <div className="info-row">
                                <label>Phone</label>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                                <button className="info-edit-btn">Edit</button>
                            </div>
                        </div>

                        {/* save and cancel buttons */}
                        <div className="button-group">
                            <button
                                className="save-btn"
                                onClick={handleSave}
                                disabled={!hasChanges}
                            >
                                save
                            </button>
                            <button
                                className="cancel-btn"
                                onClick={handleCancel}
                                disabled={!hasChanges}
                            >
                                cancel
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Profile;
