// FaqPage.tsx

import React from 'react';
import { faqList } from '../components/faq-list.ts';  // Import the FaqPage list

const FaqPage: React.FC = () => {
    return (
        <div className="vertical-container">
            <h1>Frequently Asked Questions</h1>
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

        </div>
    );
};

export default FaqPage;
