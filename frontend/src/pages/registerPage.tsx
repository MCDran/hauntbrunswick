import React from 'react';
import RegisterForm from '../components/RegisterForm';
import {Link} from "react-router-dom";

const RegisterPage: React.FC = () => {
    return (
        <div className="vertical-container">
            <h1>Register for the Event</h1>
            <RegisterForm />
            <div>
            <Link to='/' className="button">Return to Home</Link>
            </div>
        </div>
    );
};

export default RegisterPage;
