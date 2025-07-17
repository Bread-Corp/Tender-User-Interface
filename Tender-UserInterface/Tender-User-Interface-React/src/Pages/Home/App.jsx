import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from "../Login/Login";
import Navbar from "../../Components/Navbar/Navbar";
import About from "../About/About";
import Discover from "../Discover/Discover";
import Tracking from "../Tracking/Tracking";
import Profile from "../Profile/Profile";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={
                    <div style={{ padding: '2rem', paddingTop: 100 }}>
                        <h1>Tender Tool</h1>
                        <p>Backend is currently not running. This message is just a placeholder.</p>
                    </div>
                } />
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
