import { companyAPI } from '../../../services/index'

export const getCompanyProfileById = async (companyId) => {
    try {
        const response = await companyAPI.get(`/profile/${companyId}`, {
            withCredentials: true,
        });
        return { profile: response.data.profile, rating: response.data.rating };
    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
}