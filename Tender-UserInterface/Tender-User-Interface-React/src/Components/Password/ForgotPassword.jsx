import React, { useState } from "react";
import { resetPassword, confirmResetPassword } from "aws-amplify/auth";
import "./ForgotPassword.css";

const ForgotPassword = ({ onClose }) => {
    const [username, setUsername] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1); // 1 = request reset, 2 = confirm
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await resetPassword({ username });
            setStep(2);
            setMessage("Verification code sent to your email.");
        } catch (error) {
            setMessage(`${error.message || "Failed to send code"}`);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await confirmResetPassword({
                username,
                confirmationCode: code,
                newPassword,
            });
            setMessage("Password reset successful! You can now log in.");
            setTimeout(() => {
                if (onClose) onClose();
            }, 1500);
        } catch (error) {
            setMessage(`${error.message || "Failed to reset password"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-modal">
            <h2 className="forgot-password-title">
                {step === 1 ? "Forgot Password" : "Confirm Password Reset"}
            </h2>

            {step === 1 ? (
                <div className="forgot-password-form">
                    <p className="form-helper-text">
                        We'll send a verification code to this email address.
                    </p>

                    <label>
                        Email:
                        <div className="info-group">
                            <input
                                type="email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </label>

                    {message && <p className="forgot-message">{message}</p>}
                    <div className="forgot-buttons">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="send-code-btn"
                            onClick={handleRequestReset}
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Code"}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="forgot-password-form">
                    <label>
                        Verification Code:
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        New Password:
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </label>

                    {message && <p className="forgot-message">{message}</p>}
                    <div className="forgot-buttons">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="submit-btn"
                            onClick={handleConfirmReset}
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Confirm Reset"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;
