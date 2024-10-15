import mysql, {ResultSetHeader} from 'mysql2/promise'; // Use mysql2 with promise support
import dotenv from 'dotenv';
import { RowDataPacket } from 'mysql2';

dotenv.config();

console.log('DB_HOST: ', process.env.DB_HOST);
console.log('DB_USER: ', process.env.DB_USER);

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Limit the number of connections in the pool
    queueLimit: 0,
});

// Function to get registrations by registration number
export const getRegistrationsByNumber = async (registrationNumber: string): Promise<RowDataPacket[]> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM registrations WHERE registration_number = ?',
        [registrationNumber]
    );
    return rows;
};

// Function to get available time slots
export const getAvailableTimeSlots = async () => {
    try {
        const [rows] = await pool.query(
            'SELECT time_slot, spots_remaining FROM time_slots WHERE spots_remaining > 0'
        );
        console.log('Time slots:', rows); // Log the result for debugging
        return rows;
    } catch (error) {
        console.error('Database query failed:', error); // Log any database errors
        throw new Error('Database query failed');
    }
};

// Function to register attendees
export const registerAttendees = async (
    email: string,
    time_slot: string,
    attendees: { name: string; age: number }[]
): Promise<string> => {
    const connection = await pool.getConnection(); // Get connection

    await connection.beginTransaction(); // Start transaction

    try {
        // Decrement spots_remaining
        await connection.query(
            'UPDATE time_slots SET spots_remaining = spots_remaining - ? WHERE time_slot = ?',
            [attendees.length, time_slot]
        );

        // Join attendee names and ages into strings
        const names = attendees.map((attendee) => attendee.name).join(', ');
        const ages = attendees.map((attendee) => String(attendee.age)).join(', ');

        // Generate a registration number
        const registrationNumber = generateRegistrationNumber();

        // Insert the registration record with both names and ages, and the generated registration number
        await connection.query<ResultSetHeader>(
            'INSERT INTO registrations (email, time_slot, names, ages, registration_number) VALUES (?, ?, ?, ?, ?)',  // Include both names, ages, and the registration number
            [email, time_slot, names, ages, registrationNumber]
        );

        // Commit transaction
        await connection.commit();

        // Return the generated registration number for use in other processes (like QR code generation)
        return registrationNumber;
    } catch (error) {
        await connection.rollback();
        throw error; // Ensure the error is thrown so it gets caught in the calling function
    } finally {
        connection.release(); // Release the connection
    }
};


function generateRegistrationNumber(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');      // DD
    const month = String(now.getMonth() + 1).padStart(2, '0'); // MM
    const year = String(now.getFullYear()).slice(-2);        // YY
    const randomFourDigits = Math.floor(1000 + Math.random() * 9000);
    return `LC-${day}${month}${year}-${randomFourDigits}`;
}

// Function to cancel a registration
export const cancelRegistration = async (registrationId: number): Promise<void> => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Fetch the registration and its associated time_slot
        const [registrationRows] = await connection.query<RowDataPacket[]>(
            'SELECT names, time_slot FROM registrations WHERE id = ?',
            [registrationId]
        );

        if (registrationRows.length === 0) {
            throw new Error('Registration not found');
        }

        const { names, time_slot } = registrationRows[0];

        // Count the number of attendees
        const namesArray = names.split(',');
        const attendeeCount = namesArray.length;

        // Increment spots_remaining by the number of attendees being removed
        await connection.query(
            'UPDATE time_slots SET spots_remaining = spots_remaining + ? WHERE time_slot = ?',
            [attendeeCount, time_slot]
        );

        // Delete the registration
        await connection.query('DELETE FROM registrations WHERE id = ?', [registrationId]);

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const removeAttendeeFromRegistration = async (registrationId: number, attendeeName: string): Promise<void> => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Fetch the current names and ages for the registration
        const [registrationRows] = await connection.query<RowDataPacket[]>(
            'SELECT names, ages, time_slot FROM registrations WHERE id = ?',
            [registrationId]
        );

        if (registrationRows.length === 0) {
            throw new Error('Registration not found');
        }

        const { names, ages, time_slot } = registrationRows[0];

        const namesArray = names.split(',');
        const agesArray = ages.split(',');

        // Find the index of the attendee to remove
        const attendeeIndex = namesArray.findIndex((name: string) => name.trim() === attendeeName.trim());

        if (attendeeIndex === -1) {
            throw new Error(`Attendee ${attendeeName} not found in registration`);
        }

        // Remove the attendee from both names and ages arrays
        namesArray.splice(attendeeIndex, 1);
        agesArray.splice(attendeeIndex, 1);

        if (namesArray.length === 0) {
            // If no more attendees remain, delete the entire registration
            await connection.query('DELETE FROM registrations WHERE id = ?', [registrationId]);
        } else {
            // Otherwise, update the registration with the new names and ages
            await connection.query(
                'UPDATE registrations SET names = ?, ages = ? WHERE id = ?',
                [namesArray.join(','), agesArray.join(','), registrationId]
            );
        }

        // Increment the spots_remaining in the corresponding time slot
        await connection.query(
            'UPDATE time_slots SET spots_remaining = spots_remaining + 1 WHERE time_slot = ?',
            [time_slot]
        );

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};
