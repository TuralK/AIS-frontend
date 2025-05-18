import { studentAPI } from '../../../services/index'

export const createStudentLanguage = async (languageData) => {
    try {
        const response = await studentAPI.post(`/profile/language`, languageData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}
