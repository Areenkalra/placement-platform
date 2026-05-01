import axios from 'axios';

export const logActivity = async (action, details = "") => {
    try {
        const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
        await axios.post('http://localhost:5000/api/activity/log', {
            email: userEmail,
            action,
            details
        });
    } catch (err) {
        console.error("Failed to log activity", err);
    }
};
