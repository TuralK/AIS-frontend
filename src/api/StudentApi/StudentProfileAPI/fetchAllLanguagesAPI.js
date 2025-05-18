import { studentAPI } from '../../../services/index'

export const fetchAllLanguages = async () => {
    try {
        const response = await studentAPI.get('/profile/languages', {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}