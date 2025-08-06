import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import './Login.css';

const ConfirmSignUp = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const { confirmSignUp } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Get username from URL (e.g., /confirm-signup?username=testuser)
    const username = new URLSearchParams(location.search).get('username');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!username) {
            setError("Username not found. Please go back to the registration page.");
            return;
        }
        try {
            await confirmSignUp(username, code);
            // On success, send them to the login page to sign in
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-container" style={{ justifyContent: 'center', width: '500px' }}>
                <div className="login-right">
                    <h2>Confirm Your Account</h2>
                    <p>A confirmation code has been sent to your email.</p>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <label className="form-label">Confirmation Code</label>
                        <input
                            type="text"
                            placeholder="Enter the code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                        />
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <button type="submit" className="login-button">Confirm Account</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ConfirmSignUp;