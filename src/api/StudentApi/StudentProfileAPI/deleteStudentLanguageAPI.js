import { studentAPI } from '../../../services/index'

export const deleteStudentLanguage = async (languageId) => {
    try {
        const response = await studentAPI.delete(`/profile/language/${languageId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}
