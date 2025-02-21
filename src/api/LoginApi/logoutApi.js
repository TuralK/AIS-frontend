import axios from 'axios';

export const logoutApi = async (apiUrl) => {
    try {
        await axios.get(`${apiUrl}/logout`, { withCredentials: true });
        window.location.href = '/'; // Redirect to the login page because the user is logged out
    } catch (error) {
        console.error('Logout failed:', error);
    }
};
