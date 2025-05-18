import { studentAPI } from '../../../services/index'

export const fetchStudentProfile = async () => {
    try {
        const response = await studentAPI.get('/profile', {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}