import { studentAPI } from '../../services/index'

export const fetchAnnouncementData = async (announcementID) => {
    try {
        const response = await studentAPI.get(`/application/opportunities/${announcementID}`, {
            withCredentials: true,
        });
        return response.data.opportunity;
    } catch (error) {
        throw new Error(error);
    }
};