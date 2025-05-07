import axios from 'axios';

export const deleteStudentLanguage = async (languageId) => {
    try {
        const response = await axios.delete(`http://localhost:3004/profile/language/${languageId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}
