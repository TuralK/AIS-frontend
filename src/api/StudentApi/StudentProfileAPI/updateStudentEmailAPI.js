import { studentAPI } from '../../../services/index'

export const updateStudentEmail = async (email) => {
    try {
        const response = await studentAPI.put('/profile/email', {email}, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}