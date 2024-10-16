import React from "react";
import '../styles/AttendeeList.css'

interface Attendee {
    name: string;
    age: '16-20' | '21+';
}

interface AttendeeListProps {
    attendees: Attendee[];
    onAddAttendee: () => void;
    onUpdateAttendee: (index: number, field: keyof Attendee, value: string) => void;
    onRemoveAttendee: (index: number) => void;
}

const AttendeeList: React.FC<AttendeeListProps> = ({ attendees, onAddAttendee, onUpdateAttendee, onRemoveAttendee }) => {
    return (
        <div>
            {/* Add Attendee Button - Now moved to the top */}
            <button type="button" onClick={onAddAttendee}>
                Add Attendee
            </button>

            {/* Attendee List */}
            {attendees.map((attendee, index) => (
                <div className="attendee-entry" key={index}>
                <div className="attendee-inputs">
                        Name:
                        <input
                            type="text"
                            value={attendee.name}
                            onChange={(e) => onUpdateAttendee(index, 'name', e.target.value)}
                            required
                        />
                        Age:
                        <select
                            value={attendee.age}
                            onChange={(e) => onUpdateAttendee(index, 'age', e.target.value)}
                            required
                        >
                            <option value="16-20">16-20</option>
                            <option value="21+">21+</option>
                        </select>
                </div>
                    <button type="button" className="remove-button" onClick={() => onRemoveAttendee(index)}>
                        Remove
                    </button>
                </div>
            ))}
        </div>
    );
};

export default AttendeeList;
