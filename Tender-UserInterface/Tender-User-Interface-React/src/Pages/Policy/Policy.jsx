import React from 'react';
import './Policy.css';
import { useNavigate } from 'react-router-dom';

const Policy = () => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate('/login'); // redirect to login or wherever you want
    };

    return (
        <div className="privacy-wrapper">
            <div className="privacy-container">
                <h1>Privacy Policy</h1>
                <p>Effective Date: 14/09/2025</p>

                <section>
                    <h2>1. Introduction</h2>
                    <p>
                        Tender Tool is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our application.
                    </p>
                </section>

                <section>
                    <h2>2. Information We Collect</h2>
                    <p>We may collect the following types of information:</p>
                    <ul>
                        <li>Personal information such as name, email, and contact details.</li>
                        <li>Account login information for registered users.</li>
                        <li>Usage data on how you interact with our platform.</li>
                    </ul>
                </section>

                <section>
                    <h2>3. How We Use Your Information</h2>
                    <ul>
                        <li>To provide and maintain the services of Tender Tool.</li>
                        <li>To improve user experience and tailor content.</li>
                        <li>To communicate important updates, notices, or support information.</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Data Sharing</h2>
                    <p>
                        We do not sell, trade, or otherwise transfer your personal information to outside parties except for trusted service providers who assist us in operating the platform, as required by law, or to protect our rights.
                    </p>
                </section>

                <section>
                    <h2>5. Security</h2>
                    <p>
                        We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
                    </p>
                </section>

                <section>
                    <h2>6. Your Rights</h2>
                    <p>
                        You have the right to access, update, or delete your personal information. You may contact us for any privacy-related inquiries.
                    </p>
                </section>

                <section>
                    <h2>7. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. We encourage you to review this page periodically for the latest information on our privacy practices.
                    </p>
                </section>

                <section>
                    <h2>8. Contact Us</h2>
                    <p>
                        If you have any questions regarding this Privacy Policy, please contact us at <a href="mailto:support@tendertool.com">support@tendertool.com</a>.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Policy;
