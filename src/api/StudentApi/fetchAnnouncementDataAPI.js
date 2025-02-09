import axios from 'axios';

export const fetchAnnouncementData = async (announcementID) => {
    try {
        const response = await axios.get(`http://localhost:3004/opportunities/${announcementID}`, {
            withCredentials: true,
        });
        return response.data.announcement;
    } catch (error) {
        throw new Error(error);
    }
};