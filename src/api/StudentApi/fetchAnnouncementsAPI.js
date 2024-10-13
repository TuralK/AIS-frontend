import axios from 'axios';

export const fetchAnnouncements = async () => {
    try {
        const response = await axios.get('http://localhost:3004/opportunities', {
            withCredentials: true,
        });
        return response.data.announcements;
    } catch (error) {
        throw new Error(error);
    }
};