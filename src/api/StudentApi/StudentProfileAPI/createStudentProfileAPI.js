import axios from 'axios';

export const createStudentProfile = async (formData) => {
    try {
        const response = await axios.post(`http://localhost:3004/profile`, formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}
