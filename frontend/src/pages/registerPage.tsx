import React from 'react';
import RegisterForm from '../components/RegisterForm';

const RegisterPage: React.FC = () => {
    return (
        <div className="vertical-container">
            <h1>Register for the Event</h1>
            <RegisterForm />
        </div>
    );
};

export default RegisterPage;
