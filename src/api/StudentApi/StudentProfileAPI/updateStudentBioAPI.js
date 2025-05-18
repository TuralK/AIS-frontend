import { studentAPI } from '../../../services/index'

export const updateStudentBio = async (bio) => {
    try {
        const response = await studentAPI.put('/profile/bio', {bio}, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}