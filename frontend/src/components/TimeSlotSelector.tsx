import React from 'react';

interface TimeSlot {
    time_slot: string;
    spots_remaining: number;
}

interface TimeSlotSelectorProps {
    timeSlots: TimeSlot[];
    selectedTimeSlot: string;
    onSelectTimeSlot: (timeSlot: string) => void;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({ timeSlots, selectedTimeSlot, onSelectTimeSlot }) => {
    return (
        <div>
            <label>Choose a Time Slot:</label>
            <select value={selectedTimeSlot} onChange={(e) => onSelectTimeSlot(e.target.value)} required>
                <option value="" disabled>Select a time slot</option>
                {timeSlots.map((slot, index) => (
                    <option key={index} value={slot.time_slot} disabled={slot.spots_remaining === 0}>
                        {slot.time_slot} ({slot.spots_remaining} spots remaining)
                    </option>
                ))}
            </select>
        </div>
    );
};

export default TimeSlotSelector;
