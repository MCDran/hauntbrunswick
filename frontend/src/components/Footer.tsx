// src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="footer-container">
            <img src="../public/assets/COB-Logo_RGB.png" alt="City of Brunwsick" className="footer-img"/>
            <p>&copy; {new Date().getFullYear()} City of Brunswick</p>
            <img src="../public/assets/CBPR_logo_final.png" alt="City of Brunswick Parks and Recreation" className="footer-img"/>
        </footer>
    );
};

export default Footer;
