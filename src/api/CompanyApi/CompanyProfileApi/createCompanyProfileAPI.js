import { companyAPI } from '../../../services/index'

export const createCompanyProfile = async (formData) => {
    try {
        const response = await companyAPI.post(`/profile`, formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}
