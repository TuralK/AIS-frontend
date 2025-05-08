import axios from 'axios';

export const updateStudentBio = async (bio) => {
    try {
        const response = await axios.put('http://localhost:3004/profile/bio', {bio}, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}