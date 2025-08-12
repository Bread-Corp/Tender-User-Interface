import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './Login.css';
import { useLocation } from 'react-router-dom';
import TenderToolGraphic from "../../Components/TenderToolGraphic";
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [activeForm, setActiveForm] = useState('login');
    const loginTabRef = useRef(null);
    const registerTabRef = useRef(null);
    const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
    const navigate = useNavigate();
    const location = useLocation();

    // State for form inputs and errors
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    // Get auth functions from our context
    const { signIn, signUp } = useAuth();

    // This function now only handles switching the tab
    const switchTab = (tab) => {
        setError('');
        setEmail('');
        setPassword('');
        setName('');
        setActiveForm(tab);
    };

    // Correctly placed useEffect hook
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('tab') === 'register') {
            setActiveForm('register');
        }
    }, [location.search]);

    // Correctly placed useEffect hook
    useEffect(() => {
        const currentRef = activeForm === 'login' ? loginTabRef : registerTabRef;
        if (currentRef.current) {
            setUnderlineStyle({
                left: currentRef.current.offsetLeft,
                width: currentRef.current.offsetWidth,
            });
        }
    }, [activeForm]);

    // Correctly placed submit handlers
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signIn(email, password);
            navigate('/profile'); // Redirect on success
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signUp(email, password, email, name); // Using email for both username and email attribute
            navigate(`/confirm-signup?username=${email}`); // Redirect to confirm page
        } catch (err) {
            setError(err.message);
        }
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
                        <span ref={loginTabRef} className={activeForm === 'login' ? 'active-tab' : 'inactive-tab'} onClick={() => switchTab('login')}>Login</span>
                        <span ref={registerTabRef} className={activeForm === 'register' ? 'active-tab' : 'inactive-tab'} onClick={() => switchTab('register')}>Register</span>
                        <div className="underline" style={{ left: `${underlineStyle.left}px`, width: `${underlineStyle.width}px` }} />
                    </div>

                    {/* LOGIN FORM */}
                    {activeForm === 'login' ? (
                        <form className="login-form" onSubmit={handleLoginSubmit}>
                            <label className="form-label">Email</label>
                            <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                            <label className="form-label">Password</label>
                            <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                            <div className="form-options">
                                <label><input type="checkbox" /> Remember me</label>
                                <a href="#">Forgot password?</a>
                            </div>

                            <button type="submit" className="login-button">Login</button>
                        </form>
                    ) : (
                        /* REGISTER FORM */
                        <form className="login-form" onSubmit={handleRegisterSubmit}>
                            <label className="form-label">Name</label>
                            <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />

                            <label className="form-label">Email</label>
                            <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                            <label className="form-label">Password</label>
                            <input type="password" placeholder="Create password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                            <button type="submit" className="login-button">Register</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;