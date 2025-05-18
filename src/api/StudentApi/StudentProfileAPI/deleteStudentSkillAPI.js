import { studentAPI } from '../../../services/index'

export const deleteStudentSkill = async (skillId) => {
    try {
        const response = await studentAPI.delete(`/profile/skill/${skillId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}
