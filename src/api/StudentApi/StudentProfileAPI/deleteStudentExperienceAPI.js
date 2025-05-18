import { studentAPI } from '../../../services/index'

export const deleteStudentExperience = async (experienceId) => {
    try {
        const response = await studentAPI.delete(`/profile/experience/${experienceId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}
