import { studentAPI } from '../../services/index'

export const fetchAnnouncementData = async (announcementID) => {
    try {
        const response = await studentAPI.get(`/opportunities/${announcementID}`, {
            withCredentials: true,
        });
        return response.data.announcement;
    } catch (error) {
        throw new Error(error);
    }
};