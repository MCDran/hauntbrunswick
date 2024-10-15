import React from 'react';
import '../styles/VerticalContainer.css'; // Import the CSS styles

interface VerticalContainerProps {
    children: React.ReactNode;
    className?: string; // Optional custom class for extra styling if needed
}

const VerticalContainer: React.FC<VerticalContainerProps> = ({ children, className }) => {
    return (
        <div className={`vertical-container ${className || ''}`}>
            {children}
        </div>
    );
};

export default VerticalContainer;
