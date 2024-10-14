// Utility to fetch registrations
export const fetchRegistrations = async () => {
    {
        const response = await fetch('http://localhost:5000/api/registrations');
        if (!response.ok) {
            throw new Error('Failed to fetch registrations');
        }
        const data = await response.json();
        return data.data; // Assuming your API returns { success: true, data: [...] }
    }
}