import axios from 'axios';

export const fetchStudentProfile = async () => {
    try {
        const response = await axios.get('http://localhost:3004/profile', {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}