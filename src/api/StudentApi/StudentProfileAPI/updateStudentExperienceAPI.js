import axios from 'axios';

export const updateStudentExperience = async (experienceId, experienceData) => {
    try {
        const response = await axios.put(`http://localhost:3004/profile/experience/${experienceId}`, experienceData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}