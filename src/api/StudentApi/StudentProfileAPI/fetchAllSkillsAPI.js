import { studentAPI } from '../../../services/index'

export const fetchAllSkills = async () => {
    try {
        const response = await studentAPI.get('/profile/skills', {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}