import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './Login.css';
import TenderToolGraphic from "../../Components/TenderToolGraphic";
//amplify imports
import { Auth } from 'aws-amplify';



const Login = ({ onSignIn }) => {
    const [activeForm, setActiveForm] = useState('login');
    const loginTabRef = useRef(null);
    const registerTabRef = useRef(null);
    const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
    const navigate = useNavigate();
    //amplify cognito
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const currentRef = activeForm === 'login' ? loginTabRef : registerTabRef;
        if (currentRef.current) {
            setUnderlineStyle({
                left: currentRef.current.offsetLeft,
                width: currentRef.current.offsetWidth,
            });
        }
    }, [activeForm]);

    // AMPLIFY: Function to handle user sign-in
    const handleSignIn = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const user = await Auth.signIn(email, password);
            onSignIn(user); // This updates the state in App.jsx
            navigate('/home'); // Redirect to a protected page
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    };

    // AMPLIFY: Function to handle new user registration
    const handleSignUp = async (e) => {
        console.log("Register button clicked, handleSignUp function started!");
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await Auth.signUp({
                username: email,
                password,
                attributes: { name }, // Cognito requires 'name' as a standard attribute
            });
            setShowConfirmation(true); 
        } catch (err) {
            setError(err.message);
            console.error('Error during sign up attempt:', err);
        }
        setIsLoading(false);
    };

    // AMPLIFY: Function to handle the confirmation code
    const handleConfirmation = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await Auth.confirmSignUp(email, confirmationCode);
            alert('Registration successful! Please login.'); 
            // Reset form and switch to login view
            setShowConfirmation(false);
            setActiveForm('login');
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    };

    return (
        <div className="login-wrapper">
            <div className="home-icon" onClick={() => navigate('/')}>
                <FaArrowLeft />
                <span>Return Home</span>
            </div>

            <div className="login-container">
                <div className="login-left">
                    <TenderToolGraphic />
                </div>

                <div className="login-right">
                    <div className="form-toggle">
                        <span
                            ref={loginTabRef}
                            className={activeForm === 'login' ? 'active-tab' : 'inactive-tab'}
                            onClick={() => setActiveForm('login')}
                        >
                            Login
                        </span>
                        <span
                            ref={registerTabRef}
                            className={activeForm === 'register' ? 'active-tab' : 'inactive-tab'}
                            onClick={() => setActiveForm('register')}
                        >
                            Register
                        </span>
                        <div
                            className="underline"
                            style={{
                                left: `${underlineStyle.left}px`,
                                width: `${underlineStyle.width}px`,
                            }}
                        />
                    </div>

                    {activeForm === 'login' ? (
                        <form className="login-form" onSubmit={handleSignIn}>
                            <label className="form-label">Email</label>
                            <input type="email" placeholder="Enter email" required onChange={e => setEmail(e.target.value)} />

                            <label className="form-label">Password</label>
                            <input type="password" placeholder="Enter password" required onChange={e => setPassword(e.target.value)} />

                            <div className="form-options">
                                <label><input type="checkbox" /> Remember me</label>
                                <a href="#">Forgot password?</a>
                            </div>

                            <button type="submit" className="login-button" disabled={isLoading}>
                                {isLoading ? 'Logging In...' : 'Login'}
                            </button>
                        </form>
                    ) : (
                        //Handles confirmation
                            showConfirmation ? (
                            <form className="login-form" onSubmit={handleConfirmation}>
                                <h4>Confirm Your Account</h4>
                                <p>A confirmation code has been sent to {email}.</p>
                                <label className="form-label">Confirmation Code</label>
                                <input type="text" placeholder="Enter code" required onChange={e => setConfirmationCode(e.target.value)} />
                                <button type="submit" className="login-button" disabled={isLoading}>
                                    {isLoading ? 'Confirming...' : 'Confirm'}
                                </button>
                            </form>
                            ) : (
                                    //handles registration
                            <form className="login-form" onSubmit={handleSignUp}>
                            <label className="form-label">Name</label>
                            <input type="text" placeholder="Enter your name" required onChange={e => setName(e.target.value)} />

                            <label className="form-label">Email</label>
                            <input type="email" placeholder="Enter email" required onChange={e => setEmail(e.target.value)} />

                            <label className="form-label">Password</label>
                            <input type="password" placeholder="Create password" required onChange={e => setPassword(e.target.value)} />

                                        <button type="submit" className="login-button">
                                            {isLoading ? 'Registering...' : 'Register'}
                                        </button>
                                    </form>
                        )
                        )}

                    {/* AMPLIFY: Display error messages at the bottom */}
                    {error && <p className="error-message">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default Login;
