// ErrorMessage.jsx
import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const ErrorMessage = ({ message }) => {
    if (!message) return null; // don't render if no message

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#ffe6e6",
                border: "1px solid #ff4d4d",
                color: "#b30000",
                padding: "10px 15px",
                borderRadius: "8px",
                fontSize: "14px",
                margin: "15px 0",
                lineHeight: "1.4",
            }}
        >
            <FaExclamationTriangle
                style={{
                    fontSize: "30px",
                    marginRight: "15px",
                    flexShrink: 0,       // prevent it from resizing
                }}/>

            <div>
                <strong>Oops!</strong> {message}
            </div>
        </div>
    );
};

export default ErrorMessage;
