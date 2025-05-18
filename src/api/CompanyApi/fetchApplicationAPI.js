import { companyAPI } from '../../services/index'

export const fetchApplication = async (applicationId) => {
    try {
        const response = await companyAPI.get(`/applications/${applicationId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
};