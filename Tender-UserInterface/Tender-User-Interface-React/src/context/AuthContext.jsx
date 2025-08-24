import React, { createContext, useState, useEffect, useContext } from 'react';
import {
    signIn as amplifySignIn,
    signUp as amplifySignUp,
    signOut as amplifySignOut,
    confirmSignUp as amplifyConfirmSignUp,
    getCurrentUser
} from '@aws-amplify/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // This effect runs on initial app load to check for an existing session.
    useEffect(() => {
        const checkUser = async () => {
            try {
                const userData = await getCurrentUser();
                setUser(userData);
            } catch {
                // No user is signed in.
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    const signIn = async (email, password) => {
        try {
            // We use the email as the username for sign-in.
            const result = await amplifySignIn({ username: email, password });
            if (result.isSignedIn) {
                const userData = await getCurrentUser();
                setUser(userData);
            }
            return result;
        } catch (error) {
            if (error.name === 'UserAlreadyAuthenticatedException') {
                console.log("User is already authenticated. Forcing state sync.");
                const userData = await getCurrentUser();
                setUser(userData);
                return;
            }
            console.error("Error signing in:", error);
            throw error;
        }
    };

    // RECONFIGURED SIGNUP FUNCTION
    // The signature is simplified. We assume the 'username' is the 'email'.
    const signUp = async (email, password, name, surname, phoneNumber, address) => {
        try {
            return await amplifySignUp({
                username: email, // Use email as the username for sign-up
                password,
                options: {
                    userAttributes: {
                        email, // The email attribute itself
                        name,
                        phone_number: phoneNumber,
                        'custom:surname': surname,
                        'custom:address': address
                    },
                },
            });
        } catch (error) {
            console.error("Error signing up:", error);
            throw error;
        }
    };

    const confirmSignUp = async (email, code) => {
        try {
            // We use the email as the username to confirm.
            return await amplifyConfirmSignUp({ username: email, confirmationCode: code });
        } catch (error) {
            console.error("Error confirming sign up:", error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await amplifySignOut();
            setUser(null); // Clear the user from the context state.
        } catch (error) {
            console.error("Error signing out:", error);
        }
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
            {/* Don't render the rest of the app until the initial user check is complete */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom hook to easily access the auth context from any component.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};