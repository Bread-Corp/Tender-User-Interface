import React, { useState, useEffect } from 'react';
import './ManageUsers.css'; 
import { FaExclamationTriangle, FaTrash } from 'react-icons/fa';
import AddSuperUser from '../../../Components/AddSuperUser/AddSuperUser';
import { useNavigate } from 'react-router-dom';
import { fetchUserAttributes } from '@aws-amplify/auth'; 
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';

const ManageUsers = () => {
    const [users, setUsers] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 
    const navigate = useNavigate();
    const apiURL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);

                const attributes = await fetchUserAttributes();
                const currentAdminID = attributes['custom:CoreID'];

                if (!currentAdminID) {
                    throw new Error("Admin CoreID not found. You may not have permission to view this page.");
                }

                const response = await fetch(`${apiURL}/TenderUser/fetch/${currentAdminID}`, {
                                        
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    if (errorData.message === 'Invalid User') {
                        throw new Error("You do not have permission to view this page.");
                    }
                    throw new Error(errorData.message || 'Failed to fetch users');
                }

                const data = await response.json();

                setUsers(data.allUsers);

            } catch (err) {
                if (err.name === 'NotAuthorizedException') {
                    navigate('/login');
                }
                setError(err.message);
                console.error('Error fetching users:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [navigate]);

    //add super user modal state
    const [showAddUser, setShowAddUser] = useState(false);

    const handleDelete = async (userId) => {
        if (window.confirm(`Are you sure you want to delete this user?`)) {
            try {
                const response = await fetch(`${apiURL}/TenderUser/deleteuser/${userId}`, {
                    method: 'POST',
                                        
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to delete user');
                }

                setUsers(currentUsers => currentUsers.filter(user => user.userID !== userId));

            } catch (err) {
                console.error('Error deleting user:', err);
                alert(`Failed to delete user: ${err.message}`);
            }
        }
    };

    const handleOpen = () => setShowAddUser(true);
    const handleClose = () => setShowAddUser(false);
    const handleSubmit = (data) => {
        console.log('Submitted:', data);
        setShowAddUser(false);
    };

    if (loading) {
        return (
            <div className="loading-overlay">
                <LoadingSpinner text="Loading user data..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="user-management-container">
                <div className="analytics-state-wrapper"> 
                    <div className="error-state-message">
                        <span className="error-state-icon">
                            <FaExclamationTriangle />
                        </span>
                        <h2>Error Loading Users</h2>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="user-management-container">
            <header className="page-header">
                <h1>User Management ({users.length} Total)</h1>
                <button className="add-user-btn" onClick={handleOpen}>+ Add New User</button>

                {/* Modal Popup */}
                {showAddUser && (
                    <div className="modal-overlay">
                            <AddSuperUser onSubmit={handleSubmit} onCancel={handleClose} />
                    </div>
                )}
            </header>

            <div className="user-table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Registered</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.userID} >
                                <td>{user.userID.substring(0, 8)}...</td>
                                <td>{user.fullName}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`role-tag role-${user.role.toLowerCase()}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>{new Date(user.dateAppended).toLocaleDateString()}</td>
                                <td className="action-cells">
                                    <button
                                        onClick={() => handleDelete(user.userID)}
                                        className="icon-btn delete-btn"
                                        disabled={user.role === 'SuperUser'}>
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {users.length === 0 && (
                <p className="no-users-message">No users found.</p>
            )}
        </div>
    );
};

export default ManageUsers;