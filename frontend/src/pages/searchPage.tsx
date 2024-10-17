import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation to read query params
import SearchForm from '../components/SearchForm'; // Import the SearchForm component

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
    const [removing, setRemoving] = useState<boolean>(false);  // Track if removing is in progress
    const [error, setError] = useState<string | null>(null);

    const location = useLocation(); // Use useLocation hook to get query params
    const searchParams = new URLSearchParams(location.search);
    const initialRegistrationNumber = searchParams.get('registrationNumber'); // Get 'registrationNumber' from query params

    // Handle search result from SearchForm
    const handleSearchComplete = (registration: Registration | null) => {
        setRegistration(registration);
    };

    const handleRemoveAttendee = async (attendeeName: string) => {
        if (!registration) return;

        setRemoving(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:5000/api/registrations/${registration.id}/attendees`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: attendeeName }),
            });

            if (!response.ok) {
                throw new Error('Failed to remove attendee');
            }

            // Update the registration data locally (removes the attendee from names and ages)
            const updatedNames = registration.names.split(',').filter(name => name.trim() !== attendeeName.trim());
            const updatedAges = registration.ages.split(',').filter((_, i) => registration.names.split(',')[i].trim() !== attendeeName.trim());

            setRegistration({
                ...registration,
                names: updatedNames.join(','),
                ages: updatedAges.join(','),
            });
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setRemoving(false);
        }
    };

    const handleRemoveRegistration = async () => {
        if (!registration) return;

        setRemoving(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:5000/api/registrations/${registration.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to remove registration');
            }

            setRegistration(null);  // Clear the registration after deletion
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setRemoving(false);
        }
    };

    return (
        <div className="vertical-container">
            <h1>Search for a Registration</h1>
            {/* Pass the registration number from the URL as the initial value */}
            <SearchForm initialRegistrationNumber={initialRegistrationNumber || ''} onSearchComplete={handleSearchComplete} />

            {registration && (
                <div>
                    <h2>Registration Details</h2>
                    <p><strong>Registration Number:</strong> {registration.registration_number}</p>
                    <p><strong>Email:</strong> {registration.email}</p>
                    <p><strong>Time Slot:</strong> {registration.time_slot}</p>

                    <h3>Attendees</h3>
                    <ul>
                        {registration.names.split(',').map((name, index) => (
                            <li key={index}>
                                {name} - {registration.ages.split(',')[index]}
                                <button
                                    onClick={() => handleRemoveAttendee(name)}
                                    disabled={removing}
                                >
                                    Remove Attendee
                                </button>
                            </li>
                        ))}
                    </ul>

                    <button onClick={handleRemoveRegistration} disabled={removing}>
                        Remove Registration
                    </button>

                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            )}
        </div>
    );
};

export default SearchPage;
