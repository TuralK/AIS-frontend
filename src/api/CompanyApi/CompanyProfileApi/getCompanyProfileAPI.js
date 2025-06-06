import { companyAPI } from '../../../services/index'

export const getCompanyProfile = async () => {
    try {
        const response = await companyAPI.get('/profile', {
            withCredentials: true,
        });
        return {profile: response.data.profile, rating: response.data.rating};
    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
}