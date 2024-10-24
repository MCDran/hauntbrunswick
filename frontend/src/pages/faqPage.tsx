import React from 'react';
import { faqList } from '../components/faq-list.ts';
import Footer from "../components/Footer.tsx";
import { Link, useLocation } from "react-router-dom";  // Import necessary hooks

const FaqPage: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search); // Parse the query parameters
    const fromRegistration = queryParams.get('fromRegistration') === 'true';
    const handleCloseTab = () => {
        if (window.opener) {
            window.close(); // Close the tab if it was opened from the registration page
        } else {
            window.location.href = '/'; // Fallback to redirect to the home page
            console.log(Error)
        }
    };

    return (
        <div className="vertical-container">
            <h1>Frequently Asked Questions</h1>
            <div>
                <Link to='/' className="button">Return to Home</Link>
            </div>
            {/* Show close button only if opened from registration */}
            {fromRegistration && (
                <button className="button" onClick={handleCloseTab}>Return to Registration</button>
            )}
            <ul>

                {faqList.map((faq, index) => (
                    <li key={index}>
                        <h2>{faq.header}</h2>
                        {faq.items.map((item, i) => (
                            <p key={i}>{item}</p>
                        ))}
                    </li>
                ))}
            </ul>
            <Footer/>
        </div>
    );
};

export default FaqPage;
