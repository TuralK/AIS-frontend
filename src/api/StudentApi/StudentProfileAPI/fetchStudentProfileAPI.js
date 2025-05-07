import axios from 'axios';

export const fetchStudentProfile = async () => {
    try {
        const response = await axios.get('http://localhost:3004/profile', {
            withCredentials: true,
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
}