import { companyAPI } from '../../services/index'

export const fetchApplications = async () => {
    try {
        const response = await companyAPI.get('/applications', {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
};