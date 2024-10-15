import QRCode from 'qrcode';

// Function to generate QR code
export async function generateQRCode(registrationNumber: string, email: string): Promise<string> {
    try {
        const qrCodeData = `${registrationNumber}:${email}`; // Data to encode
        const qrCodeURL = await QRCode.toDataURL(qrCodeData); // Generates base64 image URL
        return qrCodeURL; // Return the generated QR code URL
    } catch (err) {
        console.error('Failed to generate QR Code', err);
        throw err; // Ensure that an error is thrown if generation fails
    }
}
