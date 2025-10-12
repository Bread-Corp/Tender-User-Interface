import React from "react";
import "./Modal.css";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content minimal">
                <h2>Join Tender Tool</h2>
                <p className="modal-intro">
                    Create an account to access tools designed to help you:
                </p>
                <ul className="modal-points">
                    <li>Save and track tenders</li>
                    <li>View personalised analytics</li>
                    <li>Receive tender notifications</li>
                </ul>
                <div className="modal-actions">
                    <button className="btn-secondary" onClick={onClose}>
                        Maybe Later
                    </button>
                    <button
                        className="btn-primary"
                        onClick={() => (window.location.href = "/login")}
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
