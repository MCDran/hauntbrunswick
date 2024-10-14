import { Router, RequestHandler } from 'express';
import { getRegistrationsByNumber, registerAttendees } from '../db';

const router = Router();

// GET route for searching registrations by registration number
const searchRegistrations: RequestHandler = async (req, res): Promise<void> => {
    const { registration_number } = req.query as { registration_number?: string };

    if (!registration_number) {
        res.status(400).json({ success: false, message: 'Registration number is required' });
        return; // Return here to ensure the function resolves with `void`
    }

    try {
        const registration = await getRegistrationsByNumber(registration_number);

        if (registration.length === 0) {
            res.status(404).json({ success: false, message: 'No registration found' });
        } else {
            res.json({ success: true, data: registration });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database query failed', error: (error as Error).message });
    }
};

// POST route for registering attendees
const registerAttendeesRoute: RequestHandler = async (req, res): Promise<void> => {
    const { email, time_slot, attendees } = req.body as {
        email: string;
        time_slot: string;
        attendees: any[];
    };

    if (!email || !time_slot || !attendees || attendees.length === 0) {
        res.status(400).json({ success: false, message: 'All fields are required' });
        return; // Return here to ensure the function resolves with `void`
    }

    try {
        await registerAttendees(email, time_slot, attendees);
        res.json({ success: true, message: 'Registration successful' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Registration failed', error: (error as Error).message });
    }
};

// Attach the handlers to the routes
router.get('/registrations/search', searchRegistrations);
router.post('/register', registerAttendeesRoute);

export default router;
