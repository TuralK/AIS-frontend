import axios from 'axios';

export const updateStudentEmail = async (email) => {
    try {
        const response = await axios.put('http://localhost:3004/profile/email', {email}, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}