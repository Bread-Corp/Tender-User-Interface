import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';

const MainLayout = ({ children }) => {
    const location = useLocation();
    const hideNavbarPaths = ['/superuser']; 

    const shouldHideNavbar = hideNavbarPaths.some(path =>
        location.pathname.startsWith(path)
    );

    return (
        <>
            {!shouldHideNavbar && <Navbar />}
            {children}
        </>
    );
};

export default MainLayout;
