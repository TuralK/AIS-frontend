import { companyAPI } from '../../../services/index'

export const getCompanyAnnouncements = async () => {
    try {
        const response = await companyAPI.get('/announcements', {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
};