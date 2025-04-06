import axios from 'axios';

export const fetchStudentFiles = async () => {
    try {
        const response = await axios.get('http://localhost:3004/files', {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}