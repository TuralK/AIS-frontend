import { studentAPI } from '../../../services/index'

export const createStudentSkill = async (skillId) => {
    try {
        const response = await studentAPI.post(`/profile/skill`, {skillId}, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}
