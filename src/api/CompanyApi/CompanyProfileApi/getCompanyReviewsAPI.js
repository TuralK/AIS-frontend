import { companyAPI } from '../../../services/index'

export const getCompanyReviews = async () => {
    try {
        const response = await companyAPI.get('/profile/reviews', {
            withCredentials: true,
        });
        return response.data.reviews;
    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
}