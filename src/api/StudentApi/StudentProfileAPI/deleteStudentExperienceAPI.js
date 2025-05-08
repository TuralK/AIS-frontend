import axios from 'axios';

export const deleteStudentExperience = async (experienceId) => {
    try {
        const response = await axios.delete(`http://localhost:3004/profile/experience/${experienceId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}
