import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from "../../Components/Navbar/Navbar";
import Home from "../Home/Home";
import Login from "../Login/Login";
import About from "../About/About";
import Discover from "../Discover/Discover";
import Tracking from "../Tracking/Tracking";
import Profile from "../Profile/Profile";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/tracking" element={<Tracking />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </Router>
    );
}

export default App;
