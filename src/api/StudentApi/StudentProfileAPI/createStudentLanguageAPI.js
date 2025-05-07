import axios from 'axios';

export const createStudentLanguage = async (languageData) => {
    try {
        const response = await axios.post(`http://localhost:3004/profile/language`, languageData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}
