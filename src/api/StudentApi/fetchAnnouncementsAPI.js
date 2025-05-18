import { studentAPI } from '../../services/index'

export const fetchAnnouncements = async () => {
    try {
        const response = await studentAPI.get('/opportunities', {
            withCredentials: true,
        });
        return response.data.announcements;
    } catch (error) {
        throw new Error(error);
    }
};