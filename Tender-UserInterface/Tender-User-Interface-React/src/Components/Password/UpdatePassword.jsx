import React, { useState } from "react";
import { updatePassword, getCurrentUser } from "aws-amplify/auth";
import "./UpdatePassword.css";

const UpdatePassword = ({ onClose }) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage("New passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            const { username } = await getCurrentUser();

            await updatePassword({
                username,
                oldPassword,
                newPassword,
            });

            setMessage("Password updated successfully!");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");

            // Optional: close popup automatically after success
            setTimeout(() => {
                if (onClose) onClose();
            }, 1500);
        } catch (error) {
            console.error("Error updating password:", error);
            setMessage(`${error.message || "Failed to change password"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="update-password-modal">
            <h2 className="update-password-title">Update Password</h2>

            <form className="update-password-form" onSubmit={handleSubmit}>
                <label>
                    Current Password:
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
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

                <label>
                    Confirm Password:
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </label>

                {message && <p className="update-message">{message}</p>}

                <div className="update-password-buttons">
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdatePassword;
