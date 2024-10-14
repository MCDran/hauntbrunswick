import React from 'react';
import { Link } from 'react-router-dom';  // Link for navigation

const HomePage: React.FC = () => {
    return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h1>Welcome to the Registration System</h1>
            <p>
                This is the home page where you can find links to important sections.
            </p>
            <div style={{ marginTop: '2rem' }}>
                <Link to="/faq">Go to FAQ</Link>
                <Link to="/registrations">Check reservation status</Link>
                <Link to="/register">Register here</Link>
            </div>
        </div>
    );
};

export default HomePage;