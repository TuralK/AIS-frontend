import { studentAPI } from '../../services/index'

export const fetchStudentFiles = async () => {
    try {
        const response = await studentAPI.get('/files', {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}