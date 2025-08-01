import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from "../../Components/Navbar/Navbar";
import Home from "../Home/Home";
import Login from "../Login/Login";
import About from "../About/About";
import Dashboard from "../Dashboard/Dashboard";
import Discover from "../Discover/Discover";
import Tracking from "../Tracking/Tracking";
import Profile from "../Profile/Profile";
import ProtectedRoute from '../../Components/ProtectedRoute';
import ConfirmSignUp from '../Login/ConfirmSignUp';

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                {/* Public Routes */ }
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/confirm-signup" element={<ConfirmSignUp />} />
                <Route path="/about" element={<About />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Protected Routes */ }          
                <Route path="/tracking" element={<ProtectedRoute><Tracking /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Routes>
        </>
    );
}

export default App;
