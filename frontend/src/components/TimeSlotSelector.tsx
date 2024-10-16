import React from 'react';
import '../styles/TimeSlotSelector.css'

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
        <div className="time-slot-selector">
            {timeSlots.map((slot, index) => (
                <div key={index} className="time-slot-item">
                    <input
                        type="radio"
                        id={`timeslot-${index}`}
                        checked={selectedTimeSlot === slot.time_slot}
                        onChange={() => onSelectTimeSlot(slot.time_slot)}
                    />
                    <label htmlFor={`timeslot-${index}`}>
                        {slot.time_slot} ({slot.spots_remaining} spots remaining)
                    </label>
                </div>
            ))}
        </div>
    );
};

export default TimeSlotSelector;
