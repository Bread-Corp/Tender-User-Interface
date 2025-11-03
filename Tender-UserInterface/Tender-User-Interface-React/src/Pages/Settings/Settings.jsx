import React, { useState, useEffect } from "react";
import "./Settings.css";
import { FaUserCircle, FaMoon, FaSun } from "react-icons/fa";
import {
    fetchUserAttributes,
    updateUserAttributes,
    signOut
} from '@aws-amplify/auth';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import { deleteUser, editUser } from '../../context/CoreLogicContext.js';
import { useTheme } from '../../context/ThemeContext.jsx';
import UpdatePassword from '../../Components/Password/UpdatePassword'

const Settings = () => {
    // profile states
    const [profileImage, setProfileImage] = useState(null);
    const [initialFormData, setInitialFormData] = useState({});
    const [formData, setFormData] = useState({});
    const [hasChanges, setHasChanges] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const dateFormatOptions = [
        { value: "dd/mm/yyyy", label: "dd/mm/yyyy" },
        { value: "mm/dd/yyyy", label: "mm/dd/yyyy" },
        { value: "yyyy-mm-dd", label: "yyyy-mm-dd" },
    ];

    // combined state
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // source to check if user is valid

    // state for the toggle
    const [activeView, setActiveView] = useState('settings'); // profile or settings

    const [dateFormat, setDateFormat] = useState(() => {
        const savedFormat = localStorage.getItem('userDateFormat');
        return savedFormat || "dd/mm/yyyy"; // Use saved or default
    });

    const { darkMode, toggleDarkMode } = useTheme(); // get dark mode state + toggle function from global context

    // update password 
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const { deleteCognitoUser } = useAuth();
    const navigate = useNavigate();

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
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [navigate]);

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
        let coreID = null;

        try {
            // Get the logged-in user attributes from Amplify
            const attributes = await fetchUserAttributes();

            //get and set coreID
            coreID = attributes['custom:CoreID'];
            console.log("CoreID:", coreID);

        } catch (error) {
            // If the user is not authenticated
            if (error.name === 'NotAuthorizedException') {
                navigate('/login');
            }
            return;
        }

        try {
            const attributesToUpdate = {
                name: formData.name ?? "",
                phone_number: formData.phone_number ?? "",
                'custom:surname': formData.surname ?? "",
                'custom:address': formData.address ?? ""
            };

            const editUserDTO = {
                email: formData.email,
                fullName: formData.name + " " + formData.surname,
                phoneNumber: formData.phone_number ?? "",
                address: formData.address ?? ""
            };

            const res = await editUser(coreID, editUserDTO);
            console.log("User Profile: CoreLogic Edit", res);

            await updateUserAttributes({
                userAttributes: attributesToUpdate
            });
            setInitialFormData({ ...formData });
            setHasChanges(false);
            setIsEditing(false);
            alert("Profile saved successfully!");
        } catch (error) {
            console.error("Error saving profile:", error);
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
            setIsAuthenticated(false);
            setFormData({});
            setInitialFormData({});
            navigate('/login');
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };

    const handleDateFormatChange = (e) => {
        const newFormat = e.target.value;
        // update the state so the UI changes
        setDateFormat(newFormat);
        // save the new format to localStorage
        localStorage.setItem('userDateFormat', newFormat);
    };

    const deleteAccount = async () => {

        const confirmed = window.confirm(
            "Are you sure you want to delete your account? This cannot be undone."
        );
        
        let coreID = null;

        try {
            // Get the logged-in user attributes from Amplify
            const attributes = await fetchUserAttributes();

            //get and set coreID
            coreID = attributes['custom:CoreID'];

        } catch (error) {
            // If the user is not authenticated
            if (error.name === 'NotAuthorizedException') {
                navigate('/login');
            }
            return;
        }

        try {
            await deleteUser(coreID);
            await deleteCognitoUser();

            alert("Account deleted successfully");
            navigate('/login');

        }
        catch (error) {
            console.error('Failed to delete account: ', error);
        }
    }

    // loading state
    if (loading) {
        return (
            <div className="loading-overlay">
                <LoadingSpinner text="Loading settings..." />
            </div>
        );
    }

    // JSX
    return (
        <div className="layout-wrapper">

            {/* container holds the toggle + the active card */}
            <div
                className={`single-card-container ${isAuthenticated ? (activeView === 'profile' ? 'view-profile' : 'view-settings') : 'view-settings'
                    }`}
            >

                {/* logged in user - show toggle */}
                {isAuthenticated && (
                    <>

                        <div className="view-toggle-container">
                            <button
                                className={`view-toggle-btn ${activeView === 'settings' ? 'active' : ''}`}
                                onClick={() => setActiveView('settings')}
                            >
                                Settings
                            </button>
                            <button
                                className={`view-toggle-btn ${activeView === 'profile' ? 'active' : ''}`}
                                onClick={() => setActiveView('profile')}
                            >
                                Profile
                            </button>
                        </div>

                        {/* conditionally render the active card based on state */}
                        {activeView === 'profile' ? (
                            // --- Profile Card JSX ---
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
                                        <input type="file" id="upload" accept="image/*" onChange={handleImageUpload} hidden />
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
                                                <input name={key} type={type} value={formData[key] || ''} onChange={handleInputChange} readOnly={!isEditing || key === 'email'} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bottom-action-bar">
                                        {!isEditing ? (
                                            <button className="edit-profile-btn bottom-only" onClick={handleEdit}>Edit Profile</button>
                                        ) : (
                                            <div className="button-group">
                                                <button className="cancel-btn" onClick={handleCancel} disabled={!isEditing}>Cancel</button>
                                                <button className="save-btn" onClick={handleSave} disabled={!hasChanges}>Save Changes</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        ) : (
                            // --- Settings Card JSX ---
                            <section className="settings-section">
                                <h2>Settings</h2>
                                <div className="settings-card">
                                    <h3 className="settings-heading">Preferences</h3>
                                        <div className="setting-row">
                                            <label>Date Format</label>
                                            <select
                                                className="settings-dropdown"
                                                value={dateFormat}
                                                onChange={handleDateFormatChange}>
                                                {dateFormatOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                 
                                    <h3 className="settings-heading">Appearance</h3>
                                    <div className="setting-row">
                                        <label>Theme</label>
                                        <button className={`dark-toggle ${darkMode ? "light" : "dark"}`} onClick={toggleDarkMode}>
                                            {darkMode ? <FaMoon /> : <FaSun />} <span className="mode-text">{darkMode ? "Dark Mode" : "Light Mode"}</span>
                                        </button>
                                    </div>
                                    {isAuthenticated && (
                                        <>
                                            <h3 className="settings-heading">Account</h3>
                                            <div className="setting-row">
                                                <label>Change Password</label>
                                                    <button className="edit-profile-btn" onClick={() => setShowPasswordModal(true)}>Update</button>
                                            </div>
                                            
                                            <div className="setting-row delete-row">
                                                <label>Delete Account</label>
                                                <button className="cancel-btn" onClick={deleteAccount}>Delete</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </section>
                        )}
                    </>
                )}

                {/* guest view - no toggle */}
                {!isAuthenticated && (
                    <section className="settings-section">
                        <h2>Settings</h2>
                        <div className="settings-card">
                            <h3 className="settings-heading">Preferences</h3>
                            <div className="setting-row">
                                <label>Date Format</label>
                                <select
                                    className="settings-dropdown"
                                    value={dateFormat}
                                    onChange={handleDateFormatChange}>
                                    {dateFormatOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <h3 className="settings-heading">Appearance</h3>
                            <div className="setting-row">
                                <label>Theme</label>
                                <button className={`dark-toggle ${darkMode ? "light" : "dark"}`} onClick={toggleDarkMode}>
                                    {darkMode ? <FaMoon /> : <FaSun />} <span className="mode-text">{darkMode ? "Dark Mode" : "Light Mode"}</span>
                                </button>
                            </div>
                        </div>
                    </section>
                )}
            </div>

            {showPasswordModal && (
                <div className="modal-overlay">
                        <UpdatePassword onClose={() => setShowPasswordModal(false)} />
                </div>
            )}
        </div>
    );
};

export default Settings;