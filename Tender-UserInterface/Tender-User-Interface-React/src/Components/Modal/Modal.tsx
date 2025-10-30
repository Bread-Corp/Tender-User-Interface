import React from "react";
import "./Modal.css";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content minimal">
                <h2>{title ?? "Join Tender Tool"}</h2>
                {message && <p className="modal-intro">{message}</p>}

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
