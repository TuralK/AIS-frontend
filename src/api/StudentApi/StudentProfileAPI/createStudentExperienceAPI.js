import { studentAPI } from '../../../services/index'

export const createStudentExperience = async (experienceData) => {
    try {
        const response = await studentAPI.post(`/profile/experience`, experienceData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}
