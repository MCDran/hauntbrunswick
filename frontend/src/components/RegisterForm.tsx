import React, { useState, useEffect } from 'react';
import TimeSlotSelector from './TimeSlotSelector';
import AttendeeList from './AttendeeList';

interface TimeSlot {
    time_slot: string;
    spots_remaining: number;
}

interface Attendee {
    name: string;
    age: '16-20' | '21+'; // The age is now a string to represent the range
}

const RegisterForm: React.FC = () => {
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [email, setEmail] = useState('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [attendees, setAttendees] = useState<Attendee[]>([{ name: '', age: '16-20' }]);
    const [isChecked, setIsChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Fetch available time slots on load
    useEffect(() => {
        const fetchTimeSlots = async () => {
            setLoading(true); // Start loading

            try {
                const response = await fetch('http://192.168.50.180:5000/api/time-slots');

                // Check if the response status is not OK
                if (!response.ok) {
                    setError(`Failed to fetch time slots. Status: ${response.status}`);
                    return;  // Exit the function here, no need to proceed
                }

                // Ensure the response is JSON
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    setError('Invalid response format. Expected JSON.');
                    return;  // Exit the function if it's not JSON
                }

                // Parse the response body
                const data = await response.json();

                // Handle data appropriately
                setTimeSlots(data.data);

            } catch (err) {
                // Log error for debugging but handle it gracefully without rethrowing
                console.error('Error in fetchTimeSlots:', err);
                setError('An error occurred while fetching time slots.');
            } finally {
                setLoading(false); // Stop loading regardless of success or failure
            }
        };

        // Execute the fetch function and handle errors locally
        fetchTimeSlots().catch(console.error);
    }, []);

    const handleAddAttendee = () => {
        setAttendees([...attendees, { name: '', age: '16-20' }]); // Default to "16-20"
    };

    const handleUpdateAttendee = (index: number, field: keyof Attendee, value: string) => {
        const updatedAttendees = [...attendees];
        updatedAttendees[index] = { ...updatedAttendees[index], [field]: value as Attendee['age'] };
        setAttendees(updatedAttendees);
    };

    const handleRemoveAttendee = (index: number) => {
        const updatedAttendees = attendees.filter((_, i) => i !== index);  // Remove the attendee at the given index
        setAttendees(updatedAttendees);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isChecked) {
            setError('You must agree to the terms');
            return;
        }

        // Ensure there are enough spots for the number of attendees
        const selectedSlot = timeSlots.find(slot => slot.time_slot === selectedTimeSlot);
        if (!selectedSlot) {
            setError('Please select a valid time slot.');
            return;
        }

        if (selectedSlot.spots_remaining < attendees.length) {
            setError('Not enough spots remaining in this time slot');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch('http://192.168.50.180:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, time_slot: selectedTimeSlot, attendees }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            setSuccessMessage('Registration successful!');
            setEmail('');
            setAttendees([{ name: '', age: '16-20' }]);
            setSelectedTimeSlot('');
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Time Slot Selector */}
            <TimeSlotSelector
                timeSlots={timeSlots}
                selectedTimeSlot={selectedTimeSlot}
                onSelectTimeSlot={setSelectedTimeSlot}
            />

            {/* Email Input */}
            <label>Email Address:</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            {/* Attendee List */}
            <AttendeeList
                attendees={attendees}
                onAddAttendee={handleAddAttendee}
                onUpdateAttendee={handleUpdateAttendee}
                onRemoveAttendee={handleRemoveAttendee}
            />

            {/* Agreement Checkbox */}
            <label>
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                />
                I agree to the terms and conditions
            </label>

            {/* Submit Button */}
            <button type="submit" disabled={loading}>
                Submit
            </button>

            {/* Error or Success Messages */}
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </form>
    );
};

export default RegisterForm;
