import { companyAPI } from '../../../services/index'

export const updateCompanyProfile = async (profileData) => {
    try {
        const response = await companyAPI.put('/profile', profileData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}