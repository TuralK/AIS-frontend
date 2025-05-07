import axios from 'axios';

export const updateStudentLanguage = async (languageId, languageData) => {
    try {
        const response = await axios.put(`http://localhost:3004/profile/language/${languageId}`, languageData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}