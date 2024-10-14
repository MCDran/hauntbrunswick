import mysql from 'mysql2/promise'; // Use mysql2 with promise support
import dotenv from 'dotenv';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

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
): Promise<void> => {
    const connection = await pool.getConnection(); // Get connection

    await connection.beginTransaction(); // Start transaction

    // Fetch spots_remaining for the time_slot
    const [timeSlotRows] = await connection.query<RowDataPacket[]>(
        'SELECT spots_remaining FROM time_slots WHERE time_slot = ? FOR UPDATE',
        [time_slot]
    );

    if (timeSlotRows.length === 0) {
        throw new Error('Time slot not found');
    }

    const spotsRemaining = timeSlotRows[0].spots_remaining;

    if (spotsRemaining < attendees.length) {
        throw new Error('Not enough spots remaining for the selected time slot');
    }

    // Decrement spots_remaining
    await connection.query(
        'UPDATE time_slots SET spots_remaining = spots_remaining - ? WHERE time_slot = ?',
        [attendees.length, time_slot]
    );

    // Insert registration
    const [result] = await connection.query<ResultSetHeader>(
        'INSERT INTO registrations (email, time_slot) VALUES (?, ?)',
        [email, time_slot]
    );

    const registrationId = result.insertId;

    // Insert attendees
    const attendeePromises = attendees.map((attendee) =>
        connection.query(
            'INSERT INTO attendees (registration_id, name, age) VALUES (?, ?, ?)',
            [registrationId, attendee.name, attendee.age]
        )
    );

    await Promise.all(attendeePromises);

    // Commit transaction
    await connection.commit();
    connection.release(); // Release connection in the success case
};

// Function to cancel a registration
export const cancelRegistration = async (registrationId: number): Promise<void> => {
    const connection = await pool.getConnection(); // Get a connection from the pool

    await connection.beginTransaction(); // Begin a transaction

    // Fetch the registration and its associated time_slot
    const [registrationRows] = await connection.query<RowDataPacket[]>(
        'SELECT time_slot FROM registrations WHERE id = ?',
        [registrationId]
    );

    if (registrationRows.length === 0) {
        throw new Error('Registration not found');
    }

    const time_slot = registrationRows[0].time_slot;

    // Count the number of attendees for this registration
    const [attendeeCountRows] = await connection.query<RowDataPacket[]>(
        'SELECT COUNT(*) as attendeeCount FROM attendees WHERE registration_id = ?',
        [registrationId]
    );

    const attendeeCount = attendeeCountRows[0].attendeeCount;

    // Increment the spots_remaining by the number of attendees
    await connection.query(
        'UPDATE time_slots SET spots_remaining = spots_remaining + ? WHERE time_slot = ?',
        [attendeeCount, time_slot]
    );

    // Delete attendees and the registration
    await connection.query('DELETE FROM attendees WHERE registration_id = ?', [registrationId]);
    await connection.query('DELETE FROM registrations WHERE id = ?', [registrationId]);

    // Commit the transaction
    await connection.commit();

    connection.release(); // Ensure connection is released properly
};
