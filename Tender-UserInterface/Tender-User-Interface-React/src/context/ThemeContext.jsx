import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

    // state that was previously in settings
    const [darkMode, setDarkMode] = useState(() => {
        const storedMode = localStorage.getItem("darkMode");
        return storedMode === "true";
    });

    // this runs on any page when the app loads
    // and again when darkMode changes
    useEffect(() => {
        document.body.classList.toggle("dark-mode", darkMode);
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode(prev => !prev);

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

// hook used in the components
export const useTheme = () => useContext(ThemeContext);