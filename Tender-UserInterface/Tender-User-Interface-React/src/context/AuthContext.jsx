import React, { createContext, useState, useEffect, useContext } from 'react';
// 1. Import the specific functions we need directly from the 'auth' module.
//    We use 'as' to rename them to avoid any naming conflicts.
import {
    signIn as amplifySignIn,
    signUp as amplifySignUp,
    signOut as amplifySignOut,
    confirmSignUp as amplifyConfirmSignUp,
    getCurrentUser
} from 'aws-amplify/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const userData = await getCurrentUser();
                setUser(userData);
            } catch {
                setUser(null);
            }
            setLoading(false);
        };
        checkUser();
    }, []);


    const signIn = async (username, password) => {
        const result = await amplifySignIn({ username, password });
        if (result.isSignedIn) {
            const userData = await getCurrentUser();
            setUser(userData);
        }
        return result;
    };

    const signUp = async (username, password, email, name) => {
        return await amplifySignUp({
            username,
            password,
            options: {
                userAttributes: {
                    email,
                    name,
                },
            },
        });
    };

    const confirmSignUp = async (username, code) => {
        return await amplifyConfirmSignUp({ username, confirmationCode: code });
    };

    const signOut = async () => {
        await amplifySignOut();
        setUser(null);
    };


    const value = {
        user,
        loading,
        signIn,
        signUp,
        confirmSignUp,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};