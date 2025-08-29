import React, { useState, useEffect } from "react";
import "./Profile.css";
import { FaUserCircle, FaMoon, FaSun } from "react-icons/fa"; // Import new icons
import {
    fetchUserAttributes,
    updateUserAttributes,
    signOut
} from '@aws-amplify/auth';
import { useNavigate } from "react-router-dom";

const Profile = () => {
    // --- State Declarations ---
    const [darkMode, setDarkMode] = useState(() => {
        const storedMode = localStorage.getItem("darkMode");
        return storedMode === "true";
    });
    const [profileImage, setProfileImage] = useState(null);
    const [initialFormData, setInitialFormData] = useState({});
    const [formData, setFormData] = useState({});
    const [hasChanges, setHasChanges] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // --- useEffect Hooks ---
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const attributes = await fetchUserAttributes();
                const attributesData = {};
                for (const [key, value] of Object.entries(attributes)) {
                    const newKey = key.startsWith('custom:') ? key.substring(7) : key;
                    attributesData[newKey] = value;
                }
                setInitialFormData(attributesData);
                setFormData(attributesData);
            } catch (error) {
                console.error("Error fetching user data:", error);
                if (error.name === 'NotAuthorizedException') {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [navigate]);

    useEffect(() => {
        document.body.classList.toggle("dark-mode", darkMode);
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasChanges) {
                e.preventDefault();
                e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [hasChanges]);


    // --- Handler Functions ---
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

    const handleSave = async () => {
        try {
            await updateUserAttributes({
                userAttributes: {
                    name: formData.name,
                    phone_number: formData.phone_number,
                    'custom:surname': formData.surname,
                    'custom:address': formData.address,
                }
            });

            setInitialFormData({ ...formData });
            setHasChanges(false);
            setEditingField(null);
            alert("Profile saved successfully!");
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Error saving profile. Please check the console for details.");
        }
    };

    const handleCancel = () => {
        setFormData({ ...initialFormData });
        setProfileImage(null);
        setHasChanges(false);
        setEditingField(null);
    };

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };

    if (loading) {
        return <div className="loading-container">Loading profile...</div>;
    }

    // --- JSX Rendering ---
    return (
        <div className="layout-wrapper">
            <div className="profile-container">
                <section className="profile-section profile-card">
                    <div className="card">
                        {/* START: DARK MODE TOGGLE FIX */}
                        <div className="profile-header">
                            <h2>Profile</h2>
                        </div>
                        {/* END: DARK MODE TOGGLE FIX */}

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
                            {[
                                { key: "email", label: "Email", type: "email" },
                                { key: "name", label: "Name", type: "text" },
                                { key: "surname", label: "Surname", type: "text" },
                                { key: "phone_number", label: "Phone Number", type: "tel" },
                                { key: "address", label: "Address", type: "text" }
                            ].map(({ key, label, type }) => (
                                <div className="info-row" key={key}>
                                    <label>{label}</label>
                                    <input
                                        name={key}
                                        type={type}
                                        value={formData[key] || ''}
                                        onChange={handleInputChange}
                                        readOnly={editingField !== key || key === 'email'}
                                    />
                                    {key !== 'email' && (
                                        editingField !== key ? (
                                            <button
                                                className="info-edit-btn"
                                                onClick={() => setEditingField(key)}
                                            >
                                                Edit
                                            </button>
                                        ) : (
                                            <span className="editing-label">Editing</span>
                                        )
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="button-group">

                            <button className="cancel-btn" onClick={handleCancel} disabled={!hasChanges}>Cancel</button>
                            <button className="save-btn" onClick={handleSave} disabled={!hasChanges}>Save</button>

                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Profile;