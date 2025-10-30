import React, { useState, useEffect } from "react";
import "./Profile.css";
import { FaUserCircle, FaMoon, FaSun } from "react-icons/fa"; 
import {
    fetchUserAttributes,
    updateUserAttributes,
    signOut
} from '@aws-amplify/auth';
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";

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
    const [isEditing, setIsEditing] = useState(false);
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

    const handleEdit = () => {
        setIsEditing(true);
    }

    const handleSave = async () => {
        try {
            // Use '?? ""' to provide an empty string if any value is null/undefined
            const attributesToUpdate = {
                name: formData.name ?? "",
                phone_number: formData.phone_number ?? "", // Specifically fixes the error
                'custom:surname': formData.surname ?? "",
                'custom:address': formData.address ?? ""
            };

            await updateUserAttributes({
                userAttributes: attributesToUpdate // Send the safe object
            });

            setInitialFormData({ ...formData });
            setHasChanges(false);
            setIsEditing(false);
            alert("Profile saved successfully!");
        } catch (error) {
            console.error("Error saving profile:", error);
            // Show a more specific error message from Cognito
            alert(`Error saving profile: ${error.message}`);
        }
    };

    const handleCancel = () => {
        setFormData({ ...initialFormData });
        setProfileImage(null);
        setHasChanges(false);
        setIsEditing(false);
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
        return (
        <div className="loading-overlay">
            <LoadingSpinner text="Fetching user profile data..." />
            </div>
        );
    }

    // --- JSX Rendering ---
    return (
        <div className="layout-wrapper">
            <div className="profile-container">
                <section className="profile-section profile-card">
                    <div className="card">
                        <div className="profile-header">
                            <h2>Profile</h2>                    
                        </div>

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
                                        readOnly={!isEditing || key === 'email'}/>
                                </div>
                            ))}
                        </div>

                        <div className="bottom-action-bar">

                            {!isEditing && (
                                <button
                                    className="edit-profile-btn bottom-only"
                                    onClick={handleEdit}>
                                    Edit Profile
                                </button>
                            )}

                        {/*conditional rendering - only show when the user is editing*/}
                            {isEditing && (
                                <div className="button-group">

                                    {/* cancel button should be enabled when editing starts */}
                                    <button
                                        className="cancel-btn"
                                        onClick={handleCancel}
                                        disabled={!isEditing}>Cancel
                                    </button>

                                    {/* Save Button */}
                                    <button className="save-btn" onClick={handleSave} disabled={!hasChanges}>
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Profile;