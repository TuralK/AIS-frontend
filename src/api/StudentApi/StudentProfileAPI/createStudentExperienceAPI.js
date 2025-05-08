import axios from 'axios';

export const createStudentExperience = async (experienceData) => {
    try {
        const response = await axios.post(`http://localhost:3004/profile/experience`, experienceData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}
