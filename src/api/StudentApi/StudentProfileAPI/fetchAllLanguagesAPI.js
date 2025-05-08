import axios from 'axios';

export const fetchAllLanguages = async () => {
    try {
        const response = await axios.get('http://localhost:3004/profile/languages', {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}