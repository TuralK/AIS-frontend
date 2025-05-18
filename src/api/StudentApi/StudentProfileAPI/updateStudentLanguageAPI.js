import { studentAPI } from '../../../services/index'

export const updateStudentLanguage = async (languageId, languageData) => {
    try {
        const response = await studentAPI.put(`/profile/language/${languageId}`, languageData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}