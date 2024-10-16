import React from 'react';
import { Link } from 'react-router-dom';
import WhatToExpect from "../components/WhatToExpect.tsx";
import VerticalContainer from "../components/VerticalContainer.tsx";  // Link for navigation
import "../App.css"
import Footer from "../components/Footer.tsx";

const HomePage: React.FC = () => {
    return (
        <VerticalContainer>
            <h1>Welcome to Haunt Brunswick</h1>
            <h2>
                Brunswick's Finest Haunted House
            </h2>
            <div>
                <Link to="/register" className="button">Register here</Link>
            </div>
            <WhatToExpect/>
            <div>
                <Link to="/faq" className="button">Go to FAQ</Link>
                <Link to="/registrations" className="button">Check/Cancel reservation</Link>
            </div>
            <Footer/>
        </VerticalContainer>
    );
};

export default HomePage;