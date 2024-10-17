// FaqPage.tsx

import React from 'react';
import { faqList } from '../components/faq-list.ts';
import Footer from "../components/Footer.tsx";
import {Link} from "react-router-dom";  // Import the FaqPage list

const FaqPage: React.FC = () => {
    return (
        <div className="vertical-container">
            <h1>Frequently Asked Questions</h1>
            <div>
            <Link to='/' className="button">Return to Home</Link>
            </div>
            <ul>
                {faqList.map((faq, index) => (
                    <li key={index}>
                        <h2>{faq.header}</h2>
                        {faq.items.map((item, i) => (
                            <p key={i}>{item}</p>
                        ))}
                        {faq.link && (
                            <a href={faq.link.url} target="_blank" rel="noopener noreferrer">
                                {faq.link.text}
                            </a>
                        )}
                    </li>
                ))}
            </ul>
            <Footer/>
        </div>
    );
};

export default FaqPage;
