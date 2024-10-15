import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// Create a transporter using SMTP credentials from environment variables
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // Use TLS
    auth: {
        user: process.env.SMTP_USER, // Loaded from env variables
        pass: process.env.SMTP_PASS  // Loaded from env variables
    },
    tls: {
        rejectUnauthorized: false // You can remove this in production
    }
});

// Define a function to send email using async/await
export const sendEmailWithQRCode = async (to: string, subject: string, text: string, qrCodeDataURL: string): Promise<void> => {
    const mailOptions = {
        from: process.env.SMTP_USER, // Sender address
        to,                          // Recipient email
        subject,                     // Email subject
        text,                        // Email content (plain text)
        attachments: [
            {
                filename: 'qrcode.png',
                content: qrCodeDataURL.split('base64,')[1], // Remove 'data:image/png;base64,' part
                encoding: 'base64'                          // Encode as base64
            }
        ]
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};
