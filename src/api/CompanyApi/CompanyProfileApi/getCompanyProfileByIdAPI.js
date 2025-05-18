import { companyAPI } from '../../../services/index'

export const getCompanyProfileById = async (companyId) => {
    try {
        const response = await companyAPI.get(`/profile/${companyId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
}