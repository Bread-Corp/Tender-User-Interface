import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './Pages/Home/App.jsx';
// Import Amplify
import { Amplify } from 'aws-amplify'; 
// Import the config file
import awsExports from './aws-exports'; 

// Configure Amplify
Amplify.configure(awsExports); 

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
