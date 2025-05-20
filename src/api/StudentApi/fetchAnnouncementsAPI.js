import { studentAPI } from '../../services/index'

export const fetchAnnouncements = async () => {
    try {
        const response = await studentAPI.get('/application/opportunities', {
            withCredentials: true,
        });
        return response.data.opportunities;
    } catch (error) {
        throw new Error(error);
    }
};