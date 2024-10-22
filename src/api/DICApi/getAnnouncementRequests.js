import axios from 'axios';

export const fetchAnnouncementRequests = async () => {
    try {
        const response = await axios.get('http://localhost:3003/announcementRequests', {
            withCredentials: true,
        });
        return response.data.announcements;
    } catch (error) {
        throw new Error(error);
    }
};