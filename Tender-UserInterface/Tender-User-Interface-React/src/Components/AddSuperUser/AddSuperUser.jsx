import React, { useState } from 'react';
import './AddSuperUser.css';
import { useAuth } from '../../context/AuthContext.jsx';

const AddSuperUser = ({ onCancel }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        organisation: '',
    });

    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (message, duration = 2000) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), duration);
    };

    const [error, setError] = useState('');
    // Access signUp function from AuthContext
    const { createSuperUser } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // handle register submit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const { email, phone, firstName, lastName, organisation } = formData;
        const id = crypto.randomUUID();

        // Format the phone number
        let formattedPhone = phone;
        if (phone && !phone.startsWith('+')) {
            formattedPhone = `+1${phone.replace(/\D/g, '')}`;
        }

        // Log the exact object we are about to send.
        const submissionData = {
            id,
            email,
            name: firstName,
            surname: lastName,
            formattedPhone,
            organisation
        };
        console.log("Submitting this data to AuthContext:", submissionData);

        //try append to cognito
        try {
            // We are using the variables from the object above
            await createSuperUser(
                submissionData.email,
                submissionData.name,
                submissionData.surname,
                submissionData.formattedPhone,
                submissionData.organisation,
                submissionData.id,
            );

            showToast("Super User registered succesfully");

            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                organisation: '',
            });
        }
        catch (err) {
            console.error("Sign-up failed:", err);
            setError('Failed to create super user. Please try again.');
        }
    };

        return (
            <div className="add-superuser-container">
                {toastMessage && (
                    <div
                        className={`toast-notification show ${toastMessage.includes("cleared") ? "toast-red" : "toast-green"}`}
                    >
                        {toastMessage}
                    </div>
                )}
                <form className="add-superuser-form" onSubmit={handleSubmit}>
                    <h2>Add New Super User</h2>

                    <label>
                        First Name
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Last Name
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Email
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Phone Number
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Organisation
                        <input
                            type="text"
                            name="organisation"
                            value={formData.organisation}
                            onChange={handleChange}
                        />
                    </label>

                    {error && <p className="error-message">{error}</p>}

                    <div className="button-group">
                        <button type="button" className="cancel-btn" onClick={onCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        );
    };

export default AddSuperUser;
