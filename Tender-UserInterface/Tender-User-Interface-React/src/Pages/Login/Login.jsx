import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, } from 'react-icons/fa';
import './Login.css';
import { useLocation } from 'react-router-dom';
import TenderToolGraphic from "../../Components/TenderToolGraphic";
import { useAuth } from '../../context/AuthContext';
import PasswordInput from '../../Components/PasswordInput';

const Login = () => {
    const [activeForm, setActiveForm] = useState('login');
    const [registerPage, setRegisterPage] = useState(1); // for multi step registration
    const loginTabRef = useRef(null);
    const registerTabRef = useRef(null);
    const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false); // toggle the password to text feature

    // state for form inputs and errors
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [surname, setSurname] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');

    const { signIn, signUp } = useAuth();
    const totalRegisterPages = 3;

    // switch between login and register tabs and reset form state
    const switchTab = (tab) => {
        setError('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
        setSurname('');
        setPhone('');
        setAddress('');
        setRegisterPage(1);
        setActiveForm(tab);
    };

    // check URL to open register tab if it was specified
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('tab') === 'register') {
            setActiveForm('register');
        }
    }, [location.search]);

    // update underline position whenever tab changes
    useEffect(() => {
        const currentRef = activeForm === 'login' ? loginTabRef : registerTabRef;
        if (currentRef.current) {
            setUnderlineStyle({
                left: currentRef.current.offsetLeft,
                width: currentRef.current.offsetWidth,
            });
        }
    }, [activeForm]);

    // handle login form submit
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signIn(email, password);
            navigate('/profile');
        } catch (err) {
            setError(err.message);
        }
    };

    // --- REPLACE THE ENTIRE handleRegisterSubmit FUNCTION WITH THIS ---
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Format the phone number
        let formattedPhone = phone;
        if (phone && !phone.startsWith('+')) {
            formattedPhone = `+1${phone.replace(/\D/g, '')}`;
        }

        // --- THIS IS THE MOST IMPORTANT STEP ---
        // Log the exact object we are about to send.
        const submissionData = {
            email,
            password,
            name,
            surname,
            formattedPhone,
            address
        };
        console.log("Submitting this data to AuthContext:", submissionData);
        // ------------------------------------

        try {
            // We are using the variables from the object above
            await signUp(
                submissionData.email,
                submissionData.password,
                submissionData.name,
                submissionData.surname,
                submissionData.formattedPhone,
                submissionData.address
            );

            navigate(`/confirm-signup?username=${email}`);

        } catch (err) {
            setError(err.message);
            console.error("Registration failed with error:", err);
        }
    };

    const renderRegisterPage = () => {
        switch (registerPage) {
            case 1:
                return (
                    <>
                        <label className="form-label">Name*</label>
                        <input type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} required />

                        <label className="form-label">Surname*</label>
                        <input type="text" placeholder="Enter surname" value={surname} onChange={(e) => setSurname(e.target.value)} required />
                                             
                    </>
                );

            case 2:
                return (
                    <>
                        <label className="form-label">Phone Number</label>
                        <input type="tel" placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />

                        <label className="form-label">Address</label>
                        <input type="text" placeholder="Enter address" value={address} onChange={(e) => setAddress(e.target.value)} />

                    </>
                );

            case 3:
                return (
                    <>
                        <label className="form-label">Email*</label>
                        <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                        <label className="form-label">Password*</label>
                        <PasswordInput label="Password" placeholder="Create password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <PasswordInput label="Confirm Password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                        {/* Password requirements message */}
                        <span style={{ fontSize: "13px", color: "#6F89BA", display: "block", marginTop: "2px" }}>
                            Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number and a special character.
                        </span>

                    </>
                );
           
            default:
                return null;
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


                    {/* user guidance messages */}
                    <div className="auth-message">
                        {activeForm === "login" ? ( // message for login page - rest are for the registration steps
                            <p>
                                <span className="highlight-text">Welcome back!</span> Please enter your login credentials below to continue.
                            </p>
                        ) : (
                            <>
                                {registerPage === 1 && (
                                    <p>
                                        <span className="highlight-text">Account Creation</span> Let’s get started with your basic details.
                                    </p>
                                )}
                                {registerPage === 2 && (
                                    <p>
                                        <span className="highlight-text">Additional Information</span>Please provide your contact details and address.
                                    </p>
                                    )}
                                {registerPage === 3 && (
                                    <p>
                                        <span className="highlight-text">Almost Done!</span>Set up your email and password to complete the registration process.
                                    </p>
                                )}
                            </>
                        )}
                    </div>

                    {/* LOGIN FORM */}
                    {activeForm === 'login' ? (
                        <form className="login-form" onSubmit={handleLoginSubmit}>
                            <label className="form-label">Email</label>
                            <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                            <label className="form-label">Password</label>

                           {/* toggle to show the text that was entered in the password field*/}
                            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required/>

                            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                            <div className="form-options">
                                <label><input type="checkbox" /> Remember me</label>
                                <a href="#">Forgot password?</a>
                            </div>

                            <div className="form-navigation">
                                <button type="submit">Login</button>
                            </div>

                        </form>
                    ) : (
                        /* REGISTER FORM with multiple steps */
                        <form className="login-form" onSubmit={handleRegisterSubmit}>          

                                {/* step indicator */}
                                <div className="step-indicator">
                                    <div className={`step-circle ${registerPage === 1 ? "active" : ""}`}></div>
                                    <div className={`step-circle ${registerPage === 2 ? "active" : ""}`}></div>
                                    <div className={`step-circle ${registerPage === 3 ? "active" : ""}`}></div>
                                </div>

                        {renderRegisterPage()}

                            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                                                         
                            <div className="form-navigation">
                                {registerPage > 1 && (
                                    <button type="button" onClick={() => setRegisterPage(registerPage - 1)}>Back</button>
                                )}

                                    {registerPage < totalRegisterPages ? (
                                    <button type="button" onClick={() => setRegisterPage(registerPage + 1)}>Continue</button>
                                ) : (
                                    <button type="submit">Complete</button>
                                    )}

                                </div>

                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
