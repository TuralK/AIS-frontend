import { companyAPI } from '../../../services/index'

export const getCompanyAnnouncements = async () => {
    try {
        const response = await companyAPI.get('/application/announcements', {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
};