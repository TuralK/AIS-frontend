import axios from 'axios';

export const createStudentSkill = async (skillId) => {
    try {
        const response = await axios.post(`http://localhost:3004/profile/skill`, {skillId}, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}
