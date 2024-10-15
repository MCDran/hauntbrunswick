// routes/registrations.ts
import { Router, RequestHandler } from 'express';
import {cancelRegistration, getRegistrationsByNumber, registerAttendees, removeAttendeeFromRegistration} from '../db';
import {sendEmailWithQRCode} from "../utils/mailer";
import {generateQRCode} from "../utils/generateQRCode";

const router = Router();

// GET route for searching registrations by registration number
const searchRegistrations: RequestHandler = async (req, res): Promise<void> => {
    const { registration_number } = req.query as { registration_number?: string };

    if (!registration_number) {
        res.status(400).json({ success: false, message: 'Registration number is required' });
        return;
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
        return;
    }

    try {
        // Register attendees in the database and get the registration number
        const registrationNumber: string = await registerAttendees(email, time_slot, attendees);

        // Generate QR code with registration number and email
        const qrCodeURL = await generateQRCode(registrationNumber, email);

        // Send email with QR code attached
        await sendEmailWithQRCode(email, 'Registration Confirmation', `Thank you for registering for the time slot: ${time_slot}.`, qrCodeURL);

        res.json({ success: true, message: 'Registration successful' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Registration failed', error: (error as Error).message });
    }
};

// In routes/registrations.ts

// DELETE route for canceling the entire registration
const cancelRegistrationRoute: RequestHandler = async (req, res) => {
    const { id } = req.params;

    try {
        await cancelRegistration(Number(id)); // Convert id to number
        res.json({ success: true, message: 'Registration canceled successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to cancel registration', error: (error as Error).message });
    }
};

// DELETE route for removing a specific attendee
const removeAttendeeRoute: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body as { name: string };

    if (!name) {
        res.status(400).json({ success: false, message: 'Attendee name is required' });
        return;
    }

    try {
        await removeAttendeeFromRegistration(Number(id), name);
        res.json({ success: true, message: `Attendee ${name} removed successfully` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to remove attendee', error: (error as Error).message });
    }
};

// Attach the handlers to the router
router.get('/registrations/search', searchRegistrations);
router.post('/register', registerAttendeesRoute);
router.delete('/registrations/:id', cancelRegistrationRoute); // Cancel entire registration
router.delete('/registrations/:id/attendees', removeAttendeeRoute); // Remove individual attendee


// Export the router as default
export default router;
