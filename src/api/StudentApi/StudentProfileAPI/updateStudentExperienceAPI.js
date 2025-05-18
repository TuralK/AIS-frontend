import { studentAPI } from '../../../services/index'

export const updateStudentExperience = async (experienceId, experienceData) => {
    try {
        const response = await studentAPI.put(`/profile/experience/${experienceId}`, experienceData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}