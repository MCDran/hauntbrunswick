import React, { useState, useEffect } from 'react';
import AttendeeList from './AttendeeList';
import '../styles/RegisterForm.css'
import '../App.css'
import TimeSlotSelector from "./TimeSlotSelector.tsx";

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
    const [attendees, setAttendees] = useState<Attendee[]>([{name: '', age: '16-20'}]);
    const [isChecked, setIsChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Fetch available time slots on load
    const fetchTimeSlots = async () => {
        setLoading(true); // Start loading
        try {
            const response = await fetch('http://192.168.50.180:5000/api/time-slots');

            if (!response.ok) {
                setError(`Failed to fetch time slots. Status: ${response.status}`);
                return;
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                setError('Invalid response format. Expected JSON.');
                return;
            }

            const data = await response.json();
            setTimeSlots(data.data); // Update the time slots with fetched data
        } catch (err) {
            console.error('Error in fetchTimeSlots:', err);
            setError('An error occurred while fetching time slots.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch time slots on component mount
    useEffect(() => {
        fetchTimeSlots();
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

            // Refetch the time slots to update the available spots
            fetchTimeSlots();
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const openFAQInNewTab = () => {
        const faqUrl = '/faq?fromRegistration=true'; // Pass the state as a query parameter
        const newTab = window.open(faqUrl, '_blank', 'noopener,noreferrer'); // Open in a new tab
        if (newTab) {
            newTab.opener = null; // Ensure no interaction with the original tab
        }
    };

    return (
        <div className="register-container">
            {/* Time Slot Selector - Left side */}
            <TimeSlotSelector
                timeSlots={timeSlots}
                selectedTimeSlot={selectedTimeSlot}
                onSelectTimeSlot={setSelectedTimeSlot}
            />

            {/* Form - Right side */}
            <div className="registration-form">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <AttendeeList
                            attendees={attendees}
                            onAddAttendee={handleAddAttendee}
                            onRemoveAttendee={handleRemoveAttendee}
                            onUpdateAttendee={handleUpdateAttendee}

                        />
                    </div>

                    <label>
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                        />
                        I/We have read, understood, and agree to the{' '}
                        <button onClick={openFAQInNewTab} className="link-button">
                            What to Expect
                        </button>
                        for the 16+ night.
                    </label>

                    <button type="submit" className="button" disabled={loading}>
                        Submit
                    </button>

                    {loading && <p>Loading...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
