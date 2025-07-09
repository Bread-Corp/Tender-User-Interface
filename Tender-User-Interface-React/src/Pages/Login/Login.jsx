import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './Login.css';
import TenderToolGraphic from "../../components/TenderToolGraphic";

const Login = () => {
    const [activeForm, setActiveForm] = useState('login');
    const loginTabRef = useRef(null);
    const registerTabRef = useRef(null);
    const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const currentRef = activeForm === 'login' ? loginTabRef : registerTabRef;
        if (currentRef.current) {
            setUnderlineStyle({
                left: currentRef.current.offsetLeft,
                width: currentRef.current.offsetWidth,
            });
        }
    }, [activeForm]);

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
                        <form className="login-form">
                            <label className="form-label">Email</label>
                            <input type="email" placeholder="Enter email" required />

                            <label className="form-label">Password</label>
                            <input type="password" placeholder="Enter password" required />

                            <div className="form-options">
                                <label><input type="checkbox" /> Remember me</label>
                                <a href="#">Forgot password?</a>
                            </div>

                            <button type="submit" className="login-button">Login</button>
                        </form>
                    ) : (
                        <form className="login-form">
                            <label className="form-label">Name</label>
                            <input type="text" placeholder="Enter your name" required />

                            <label className="form-label">Email</label>
                            <input type="email" placeholder="Enter email" required />

                            <label className="form-label">Password</label>
                            <input type="password" placeholder="Create password" required />

                            <button type="submit" className="login-button">Register</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
