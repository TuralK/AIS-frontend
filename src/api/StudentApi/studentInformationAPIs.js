import { studentAPI } from '../../services/index'

export const getStudentInformation = async () => {
    try {
        const response = await studentAPI.get('/studentInfo', {
            withCredentials: true,
        });
        return response.data.studentInfo;
    } catch (error) {
        throw new Error(error);
    }
}

export const updateStudentInformation = async (formData) => {
    try {
        const response = await studentAPI.put('/studentInfo', formData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}

export const createStudentInformation = async (formData) => {
    try {
        const response = await studentAPI.post('/studentInfo', formData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}