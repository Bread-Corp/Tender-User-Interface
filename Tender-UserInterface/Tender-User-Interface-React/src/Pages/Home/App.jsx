import { Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './App.css';
import Home from "../Home/Home";
import Login from "../Login/Login";
import Policy from "../Policy/Policy";
import Discover from "../Discover/Discover";
import Tracking from "../Tracking/Tracking";
import Profile from "../Profile/Profile";
import TenderDetails from "../TenderDetails/TenderDetails";
import ProtectedRoute from '../../Components/ProtectedRoute';
import ConfirmSignUp from '../Login/ConfirmSignUp';
import Settings from "../Settings/Settings";
import Analytics from "../Analytics/Analytics";
import { ThemeProvider } from '../../context/ThemeContext.jsx';
import Dashboard from '../SuperUser/Dashboard/Dashboard';
import ManageUsers from '../SuperUser/ManageUsers/ManageUsers';
import MainLayout from '../../Components/Layout/MainLayout'; 
import Navbar from '../../Components/Navbar/Navbar';

import { useAuth } from '../../context/AuthContext';

function App() {

    const { user } = useAuth();

    // manage authentication state
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isNotification, setIsNotification] = useState(true);

    useEffect(() => {
        if (user === null || user === undefined) {
            setIsSignedIn(false);
            console.log("false");
        } else {
            setIsSignedIn(true);
            localStorage.setItem("userToken", true); 
            console.log("true");
        }
    }, [user]);

    // function to update state
    const handleLogin = () => {
        setIsSignedIn(true);
        console.log(isSignedIn);
    };

    const handleLogout = () => {
        setIsSignedIn(false);
        setIsAdmin(false);
    };

    const handleAdmin = () => {
        setIsAdmin(true);
        console.log(isAdmin);
    }

    const handleNewNotif = () => {
        setIsNotification(true);
        console.log(isNotification);
    }

    const handleReadNotif = () => {
        setIsNotification(false);
    }

    return (
        <ThemeProvider>
            <MainLayout>
            {/* pass state and handler to nav */}
            <Navbar isSignedIn={isSignedIn} onLogoutSuccess={handleLogout} isAdmin={isAdmin} isNotification={isNotification} onReadNotif={handleReadNotif} />
            <Routes>

                {/* Public Routes */ }
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login onLoginSuccess={handleLogin} onAdminSuccess={handleAdmin} />} />
                <Route path="/confirm-signup" element={<ConfirmSignUp />} />
                <Route path="/policy" element={<Policy />} />
                <Route path="/discover" element={<Discover onNewNotif={handleNewNotif} />} />
                <Route path="/tender/:id" element={<TenderDetails />} />
                <Route path="/analytics" element={<Analytics />} />

                {/* Protected Routes */ }          
                <Route path="/tracking" element={<ProtectedRoute><Tracking onNewNotif={handleNewNotif} /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/settings" element={<Settings />} />/*Fix protection*/

                {/* SuperUser Routes */}
                <Route path="/superuser/dashboard" element={<Dashboard />} />
                <Route path="/superuser/manageusers" element={<ManageUsers />} />
                </Routes>
            </MainLayout>
        </ThemeProvider>
    );
}

export default App;
