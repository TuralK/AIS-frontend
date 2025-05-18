import { adminAPI } from '../../services/index'

export const fetchAnnouncementRequests = async () => {
    try {
        const response = await adminAPI.get('/announcementRequests', {
            withCredentials: true,
        });
        return response.data.announcements;
    } catch (error) {
        throw new Error(error);
    }
};