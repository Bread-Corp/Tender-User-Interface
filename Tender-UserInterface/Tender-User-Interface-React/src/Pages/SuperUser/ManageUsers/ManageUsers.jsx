import React, { useState } from 'react';
import './ManageUsers.css'; 
import { FaUserEdit, FaTrash } from 'react-icons/fa';

// MOCK DATA
const MOCK_USERS = [
    { id: '1', coreId: 'C1001', name: 'Alice Johnson', email: 'alice.j@corp.com', role: 'Standard', registered: '2024-01-15', lastLogin: '2025-09-28' },
    { id: '2', coreId: 'C1002', name: 'Bob Smith', email: 'bob.s@corp.com', role: 'SuperUser', registered: '2023-11-01', lastLogin: '2025-10-24' },
    { id: '3', coreId: 'C1003', name: 'Charlie Davis', email: 'charlie.d@corp.com', role: 'Standard', registered: '2025-05-20', lastLogin: '2025-05-20' },
    { id: '4', coreId: 'C1004', name: 'Dana Evans', email: 'dana.e@corp.com', role: 'Standard', registered: '2024-09-01', lastLogin: '2025-10-20' },
    { id: '5', coreId: 'C1005', name: 'Ethan Fox', email: 'ethan.f@corp.com', role: 'Standard', registered: '2025-10-23', lastLogin: 'N/A' },
];

const ManageUsers = () => {
    const [users, setUsers] = useState(MOCK_USERS);

    // mock handlers
    const handleEdit = (userId) => {
        console.log(`Editing user with ID: ${userId}`);
        // logic to open a modal or navigate to an edit form
    };

    const handleDelete = (userId) => {
        if (window.confirm(`Are you sure you want to delete user ID ${userId}?`)) {
            console.log(`Deleting user with ID: ${userId}`);
            setUsers(users.filter(user => user.id !== userId));
        }
    };

    return (
        <div className="user-management-container">
            <header className="page-header">
                <h1>User Management ({users.length} Total)</h1>
                <button className="add-user-btn">+ Add New User</button>
            </header>

            <div className="user-table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>CoreID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Registered</th>
                            <th>Last Login</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} >
                                <td>{user.id}</td>
                                <td>{user.coreId}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td><span className={`role-tag role-${user.role.toLowerCase()}`}>{user.role}</span></td>
                                <td>{user.registered}</td>
                                <td>{user.lastLogin}</td>
                                <td className="action-cells">
                                    <button onClick={() => handleEdit(user.id)} className="icon-btn edit-btn">
                                        <FaUserEdit />
                                    </button>
                                    <button onClick={() => handleDelete(user.id)} className="icon-btn delete-btn">
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