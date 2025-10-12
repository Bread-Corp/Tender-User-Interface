import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from "../../Components/Navbar/Navbar";
import Home from "../Home/Home";
import Login from "../Login/Login";
import Policy from "../Policy/Policy";
import Dashboard from "../Dashboard/Dashboard";
import Discover from "../Discover/Discover";
import Tracking from "../Tracking/Tracking";
import Profile from "../Profile/Profile";
import TenderDetails from "../TenderDetails/TenderDetails";
import ProtectedRoute from '../../Components/ProtectedRoute';
import ConfirmSignUp from '../Login/ConfirmSignUp';
import Settings from "../Settings/Settings";
import Analytics from "../Analytics/Analytics";


function App() {
    return (
        <>
            <Navbar />
            <Routes>
                {/* Public Routes */ }
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/confirm-signup" element={<ConfirmSignUp />} />
                <Route path="/policy" element={<Policy />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/tender/:id" element={<TenderDetails />} />
                <Route path="/dashboard" element={<Dashboard />} />
                {/* Protected Routes */ }          
                <Route path="/tracking" element={<ProtectedRoute><Tracking /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/settings" element={<Settings />} />/*Fix protection*/
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            </Routes>
        </>
    );
}

export default App;
