import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from "../login/Login";
import Navbar from "../../components/navbar/Navbar";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={
                    <div style={{ padding: '2rem' }}>
                        <h1>Tender Tool</h1>
                        <p>Backend is currently not running. This message is just a placeholder.</p>
                    </div>
                } />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
