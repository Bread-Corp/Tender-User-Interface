import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './Pages/Home/App.jsx';
//  Import Amplify and the configuration file
import { Amplify } from 'aws-amplify';
import amplifyconfig from './amplifyconfiguration.json';
import { BrowserRouter as Router} from 'react-router-dom';
// Import your AuthProvider
import { AuthProvider } from './context/AuthContext';



// Configure Amplify
Amplify.configure(amplifyconfig);


const root = createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
      <Router>
        <AuthProvider>
            <App />
            </AuthProvider>
      </Router>
    </React.StrictMode>,
);
