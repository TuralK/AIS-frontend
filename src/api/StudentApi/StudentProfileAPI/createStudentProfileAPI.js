import { studentAPI } from '../../../services/index'

export const createStudentProfile = async (formData) => {
    try {
        const response = await studentAPI.post(`profile`, formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}
