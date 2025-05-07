import axios from 'axios';

export const fetchAllSkills = async () => {
    try {
        const response = await axios.get('http://localhost:3004/profile/skills', {
            withCredentials: true,
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}