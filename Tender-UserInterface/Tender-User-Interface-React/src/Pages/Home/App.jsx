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
import Archive from '../SuperUser/Archive/Archive';
import ManageUsers from '../SuperUser/ManageUsers/ManageUsers';
import MainLayout from '../../Components/Layout/MainLayout'; 
import Navbar from '../../Components/Navbar/Navbar';

import { useAuth } from '../../context/AuthContext';
import { fetchUserAttributes } from '@aws-amplify/auth';
import { Navigate } from 'react-router-dom';

function App() {

    const { user } = useAuth();

    // manage authentication state
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isNotification, setIsNotification] = useState(false);

    useEffect(() => {
        const checkStates = async () => {
            if (user === null || user === undefined) {
                setIsSignedIn(false);
                console.log("false");
                return;
            }


            setIsSignedIn(true);
            localStorage.setItem("userToken", true);
            console.log("true");

            try {

                const attributes = await fetchUserAttributes();
                const role = attributes['custom:Role'];
                setIsAdmin(role === 'SuperUser');
                console.log("Admin? ", role === 'SuperUser');
            } catch (attrError) {
                console.error("Error fetching user attributes:", attrError);
            }
        };

        checkStates();
    }, [user]);

    //function to validate admin, if signed in on start
    useEffect(() => {
        console.log("IsSignedIn updated:", isSignedIn);
        console.log("isAdmin updated:", isAdmin);
    }, [isAdmin, isSignedIn]);

    // functions to update states
    const handleLogin = () => {
        setIsSignedIn(true);
    };

    const handleLogout = () => {
        setIsSignedIn(false);
        setIsAdmin(false);
    };

    const handleAdmin = () => {
        setIsAdmin(true);
    }

    const handleNewNotif = () => {
        setIsNotification(true);
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
                <Route path="/superuser/dashboard" element={isAdmin ? <Dashboard /> : <Navigate to="/" />} />
                <Route path="/superuser/manageusers" element={isAdmin ? <ManageUsers /> : <Navigate to="/" />} />
                <Route path="/superuser/archive" element={isAdmin ? <Archive /> : <Navigate to="/" />} />
                </Routes>
            </MainLayout>
        </ThemeProvider>
    );
}

export default App;
