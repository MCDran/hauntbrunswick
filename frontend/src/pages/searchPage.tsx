import React, { useState } from 'react';
import SearchForm from '../components/SearchForm';  // Import the SearchForm component

interface Registration {
    id: number;
    registration_number: string;
    email: string;
    time_slot: string;
    names: string;
    ages: string;
    created_at: string;
}

const SearchPage: React.FC = () => {
    const [registration, setRegistration] = useState<Registration | null>(null);

    // Handle search result from SearchForm
    const handleSearchComplete = (registration: Registration | null) => {
        setRegistration(registration);
    };

    return (
        <div>
            <h1>Search for a Registration</h1>
            <SearchForm onSearchComplete={handleSearchComplete} />

            {registration && (
                <div>
                    <h2>Registration Details</h2>
                    <p><strong>Registration Number:</strong> {registration.registration_number}</p>
                    <p><strong>Email:</strong> {registration.email}</p>
                    <p><strong>Time Slot:</strong> {registration.time_slot}</p>
                    <p><strong>Names:</strong> {registration.names}</p>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
