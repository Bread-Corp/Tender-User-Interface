import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// componenet for password input: includes visibility toggling and regex for security

const PasswordInput = ({ value, onChange, placeholder, required = false }) => {
    const [show, setShow] = useState(false);
    const [error, setError] = useState(""); // validation message

    return (
        <div className="password-wrapper" style={{ position: "relative" }}>
            <input
                type={show ? "text" : "password"} // if show = true then show password as text
                placeholder={placeholder} //placeholder text for input field
                value={value}
                onChange={onChange} // runs whenever user types something
                autoComplete="new-password" // tell browser not to suggest saved passwords
                required={required} // must fill in fields if required = true. false by default 
                style={{ paddingRight: "35px" }}
            />



            <span
                onClick={() => setShow(!show)} // flips show between true and false when clicked
                style={{
                    position: "absolute",
                    right: "15px",
                    top: "13px",
                    cursor: "pointer",
                    fontSize: "18px",
                    userSelect: "none"
                }}
            >
                {show ? <FaEyeSlash /> : <FaEye />} {/*show eye if false , eye with slash if true*/}
            </span>

        </div>
    );
};

export default PasswordInput;