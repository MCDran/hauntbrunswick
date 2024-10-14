import React, { useState } from 'react';

interface Registration {
    id: number;
    registration_number: string;
    email: string;
    time_slot: string;
    names: string;
    ages: string;
    created_at: string;
}

interface SearchFormProps {
    onSearchComplete: (registration: Registration | null) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearchComplete }) => {
    const [registrationNumber, setRegistrationNumber] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:5000/api/registrations/search?registration_number=${registrationNumber}`);

            if (!response.ok) {
                throw new Error('No registration found for that number');
            }

            const data = await response.json();
            onSearchComplete(data.data[0]);  // Pass the result to the parent component
        } catch (err) {
            setError((err as Error).message);
            onSearchComplete(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSearch}>
            <label>
                Registration Number:
                <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                />
            </label>
            <button type="submit" disabled={loading}>Search</button>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default SearchForm;
