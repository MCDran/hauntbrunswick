import React from "react";

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

const AttendeeList: React.FC<AttendeeListProps> = ({
                                                       attendees,
                                                       onAddAttendee,
                                                       onUpdateAttendee,
                                                       onRemoveAttendee,
                                                   }) => {
    return (
        <div>
            {attendees.map((attendee, index) => (
                <div key={index}>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={attendee.name}
                        onChange={(e) => onUpdateAttendee(index, 'name', e.target.value)}
                        required
                    />

                    <label>Age:</label>
                    <select
                        value={attendee.age}
                        onChange={(e) => onUpdateAttendee(index, 'age', e.target.value)}
                        required
                    >
                        <option value="16-20">16-20</option>
                        <option value="21+">21+</option>
                    </select>

                    <button type="button" onClick={() => onRemoveAttendee(index)}>
                        Remove
                    </button>
                </div>
            ))}

            <button type="button" onClick={onAddAttendee}>
                Add Attendee
            </button>
        </div>
    );
};

export default AttendeeList;
