import express from 'express';
import { getAvailableTimeSlots } from '../db'; // Assume this function gets available time slots from the database

const router = express.Router();

router.get('/time-slots', async (req, res) => {
    try {
        const timeSlots = await getAvailableTimeSlots();

        // Return the time slots as JSON
        res.json({ success: true, data: timeSlots });
    } catch (error) {
        console.error('Error fetching time slots:', error); // Log the error for debugging
        res.status(500).json({ success: false, message: 'Failed to fetch time slots', error: (error as Error).message });
    }
});

export default router;
