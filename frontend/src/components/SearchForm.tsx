import React, { useEffect, useState } from 'react';

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
    initialRegistrationNumber?: string; // Allow initial registration number to be passed
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearchComplete, initialRegistrationNumber }) => {
    const [registrationNumber, setRegistrationNumber] = useState<string>(initialRegistrationNumber || '');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Perform the search when the form is submitted
    const handleSearch = async (registrationNum: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:5000/api/registrations/search?registration_number=${registrationNum}`);

            if (!response.ok) {
                const errorMessage = response.status === 404
                    ? 'Registration not found'
                    : 'An error occurred while fetching the registration';
                throw new Error(errorMessage);
            }

            const data = await response.json();
            if (data.data && data.data.length > 0) {
                onSearchComplete(data.data[0]); // Pass the first registration result to the parent component
            } else {
                onSearchComplete(null);
                setError('No registration found for that number');
            }
        } catch (err) {
            setError((err as Error).message);
            onSearchComplete(null);
        } finally {
            setLoading(false);
        }
    };

    // Auto search when component mounts if initialRegistrationNumber is provided
    useEffect(() => {
        if (initialRegistrationNumber) {
            handleSearch(initialRegistrationNumber);
        }
    }, [initialRegistrationNumber]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(registrationNumber);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Registration Number:
                <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    required
                />
            </label>
            <button type="submit" className="button" disabled={loading || !registrationNumber.trim()}>
                {loading ? 'Searching...' : 'Search'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default SearchForm;
