import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Auth } from 'aws-amplify';

import './App.css';
import Navbar from "../../Components/Navbar/Navbar";
import Home from "../Home/Home";
import Login from "../Login/Login";
import About from "../About/About";
import Dashboard from "../Dashboard/Dashboard";
import Discover from "../Discover/Discover";
import Tracking from "../Tracking/Tracking";
import Profile from "../Profile/Profile";
import Settings from "../Settings/Settings";

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const user = await Auth.currentAuthenticatedUser();
                setCurrentUser(user);
            } catch {
                setCurrentUser(null);
            }
            setIsLoading(false);
        };

        checkUser();
    }, []);

    const handleSignOut = async () => {
        try {
            await Auth.signOut();
            setCurrentUser(null);
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <Navbar user={currentUser} handleSignOut={handleSignOut} />
            <Routes>
                <Route path="/" element={
                    <div style={{ padding: '2rem', paddingTop: 100 }}>
                        <h1>Tender Tool</h1>
                        <p>Backend is currently not running. This message is just a placeholder.</p>
                    </div>
                } />
                <Route path="/login" element={<Login onSignIn={setCurrentUser} />} />
                <Route path="/about" element={<About />} />
                <Route path="/discover" element={<Discover />} />

                <Route
                    path="/profile"
                    element={currentUser ? <Profile user={currentUser} /> : <Login onSignIn={setCurrentUser} />}
                />
                <Route
                    path="/tracking"
                    element={currentUser ? <Tracking /> : <Login onSignIn={setCurrentUser} />}
                />
// Routing done without the Cognito implementation. [Legacy]
//                 <Route path="/tracking" element={<Tracking />} />
//                 <Route path="/profile" element={<Profile />} />
//                 <Route path="/dashboard" element={<Dashboard />} />
//                 <Route path="/settings" element={<Settings />} />
            </Routes>
        </Router>
    );
}

export default App;